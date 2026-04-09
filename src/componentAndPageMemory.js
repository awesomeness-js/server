import { createHash } from "crypto";
import { readFileSync, statSync } from "fs";
import extractUiComponentRefs from "./extractUiComponentRefs.js";

const FILE_CACHE_LIMIT = 2000;
const REFS_CACHE_LIMIT = 5000;

const fileCache = new Map();
const refsCache = new Map();

const DEFAULT_EXTRACT_OPTIONS = Object.freeze({
	namespace: "ui",
	includeCall: true,
	includeDotAccess: false,
	cacheContext: "",
});

function toMB(bytes) {

	return Number((bytes / (1024 * 1024)).toFixed(6));

}

function toGB(bytes) {

	return Number((bytes / (1024 * 1024 * 1024)).toFixed(6));

}

function withMBGB(bytes) {

	return {
		bytes,
		mb: toMB(bytes),
		gb: toGB(bytes),
	};

}

function pruneCache(cache, limit) {

	if (cache.size <= limit) {

		return;
	
	}

	const deleteCount = cache.size - limit;
	let i = 0;

	for (const key of cache.keys()) {

		cache.delete(key);
		i += 1;

		if (i >= deleteCount) {

			break;
		
		}
	
	}

}

function hashContent(content) {

	return createHash("sha1").update(content).digest("hex");

}

function normalizeExtractOptions(
	{
		namespace = DEFAULT_EXTRACT_OPTIONS.namespace,
		includeCall = DEFAULT_EXTRACT_OPTIONS.includeCall,
		includeDotAccess = DEFAULT_EXTRACT_OPTIONS.includeDotAccess,
		cacheContext,
	} = {},
	{
		defaultCacheContext = DEFAULT_EXTRACT_OPTIONS.cacheContext,
	} = {}
) {

	return {
		namespace,
		includeCall,
		includeDotAccess,
		cacheContext: cacheContext ?? defaultCacheContext,
	};

}

function refsCacheKey(content, options = {}) {

	const {
		namespace,
		includeCall,
		includeDotAccess,
		cacheContext,
	} = normalizeExtractOptions(options);
	const contentHash = hashContent(content);
	const contextPart = cacheContext ? `${cacheContext}|` : "";

	return `${contextPart}${namespace}|${includeCall}|${includeDotAccess}|${contentHash}`;

}

function refsCacheKeyFromFile(filePath, fileMeta, options = {}) {

	const {
		namespace,
		includeCall,
		includeDotAccess,
		cacheContext,
	} = normalizeExtractOptions(options, {
		defaultCacheContext: `file:${filePath}`,
	});
	const contextPart = cacheContext ? `${cacheContext}|` : "";

	return `${contextPart}${namespace}|${includeCall}|${includeDotAccess}|mtime:${fileMeta.mtimeMs}|size:${fileMeta.size}`;

}

function getFileCacheEntry(filePath) {

	const stat = statSync(filePath);
	const cacheEntry = fileCache.get(filePath);

	if (
		cacheEntry &&
		cacheEntry.mtimeMs === stat.mtimeMs &&
		cacheEntry.size === stat.size
	) {

		return cacheEntry;
	
	}

	const content = readFileSync(filePath, "utf-8");
	const nextEntry = {
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		content,
	};

	fileCache.set(filePath, nextEntry);
	pruneCache(fileCache, FILE_CACHE_LIMIT);

	return nextEntry;

}

export function readFileMemoized(filePath) {

	return getFileCacheEntry(filePath).content;

}

export function extractUiRefsMemoized(content, options = {}) {

	if (typeof content !== "string" || !content.length) {

		return [];
	
	}

	const extractionOptions = normalizeExtractOptions(options);
	const key = refsCacheKey(content, extractionOptions);
	const existing = refsCache.get(key);

	if (existing) {

		return existing;
	
	}

	const refs = extractUiComponentRefs(content, extractionOptions);

	refsCache.set(key, refs);
	pruneCache(refsCache, REFS_CACHE_LIMIT);

	return refs;

}

export function extractUiRefsFromFileMemoized(filePath, options = {}) {

	const fileEntry = getFileCacheEntry(filePath);
	const extractionOptions = normalizeExtractOptions(options, {
		defaultCacheContext: `file:${filePath}`,
	});
	const key = refsCacheKeyFromFile(filePath, fileEntry, extractionOptions);
	const existing = refsCache.get(key);

	if (existing) {

		return existing;
	
	}

	const refs = extractUiComponentRefs(fileEntry.content, extractionOptions);

	refsCache.set(key, refs);
	pruneCache(refsCache, REFS_CACHE_LIMIT);

	return refs;

}

export function clearComponentAndPageMemory() {

	fileCache.clear();
	refsCache.clear();

}

export function getComponentAndPageMemoryStatus({
	includeKeys = true,
	sampleSize = 25,
} = {}) {

	let fileCacheBytes = 0;

	for (const value of fileCache.values()) {

		fileCacheBytes += Buffer.byteLength(value.content || "", "utf-8");
	
	}

	let refsCacheBytes = 0;

	for (const [ key, value ] of refsCache.entries()) {

		refsCacheBytes += Buffer.byteLength(key, "utf-8");
		refsCacheBytes += Buffer.byteLength(JSON.stringify(value || []), "utf-8");
	
	}

	const processMemoryUsage = typeof process?.memoryUsage === "function"
		? process.memoryUsage()
		: null;
	const totalCacheBytes = fileCacheBytes + refsCacheBytes;
	const processMemoryUsageWithUnits = processMemoryUsage
		? {
			rss: withMBGB(processMemoryUsage.rss || 0),
			heapTotal: withMBGB(processMemoryUsage.heapTotal || 0),
			heapUsed: withMBGB(processMemoryUsage.heapUsed || 0),
			external: withMBGB(processMemoryUsage.external || 0),
			arrayBuffers: withMBGB(processMemoryUsage.arrayBuffers || 0),
		}
		: null;

	const out = {
		limits: {
			fileCacheLimit: FILE_CACHE_LIMIT,
			refsCacheLimit: REFS_CACHE_LIMIT,
		},
		counts: {
			fileCacheEntries: fileCache.size,
			refsCacheEntries: refsCache.size,
		},
		approximateBytes: {
			fileCacheBytes,
			refsCacheBytes,
			totalCacheBytes,
		},
		approximateMemory: {
			fileCache: withMBGB(fileCacheBytes),
			refsCache: withMBGB(refsCacheBytes),
			totalCache: withMBGB(totalCacheBytes),
		},
		processMemoryUsage,
		processMemoryUsageWithUnits,
	};

	if (includeKeys) {

		out.keys = {
			fileCacheKeys: [ ...fileCache.keys() ].slice(0, sampleSize),
			refsCacheKeys: [ ...refsCache.keys() ].slice(0, sampleSize),
		};
	
	}

	return out;

}

const componentAndPageMemory = {
	readFileMemoized,
	extractUiRefsMemoized,
	extractUiRefsFromFileMemoized,
	clearComponentAndPageMemory,
	getComponentAndPageMemoryStatus,
};

export default componentAndPageMemory;
