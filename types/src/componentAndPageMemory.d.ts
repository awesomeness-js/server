export function readFileMemoized(filePath: any): any;
export function extractUiRefsMemoized(content: any, options?: {}): any;
export function extractUiRefsFromFileMemoized(filePath: any, options?: {}): any;
export function clearComponentAndPageMemory(): void;
export function getComponentAndPageMemoryStatus({ includeKeys, sampleSize, }?: {
    includeKeys?: boolean | undefined;
    sampleSize?: number | undefined;
}): {
    limits: {
        fileCacheLimit: number;
        refsCacheLimit: number;
    };
    counts: {
        fileCacheEntries: number;
        refsCacheEntries: number;
    };
    approximateBytes: {
        fileCacheBytes: number;
        refsCacheBytes: number;
        totalCacheBytes: number;
    };
    approximateMemory: {
        fileCache: {
            bytes: any;
            mb: number;
            gb: number;
        };
        refsCache: {
            bytes: any;
            mb: number;
            gb: number;
        };
        totalCache: {
            bytes: any;
            mb: number;
            gb: number;
        };
    };
    processMemoryUsage: any;
    processMemoryUsageWithUnits: {
        rss: {
            bytes: any;
            mb: number;
            gb: number;
        };
        heapTotal: {
            bytes: any;
            mb: number;
            gb: number;
        };
        heapUsed: {
            bytes: any;
            mb: number;
            gb: number;
        };
        external: {
            bytes: any;
            mb: number;
            gb: number;
        };
        arrayBuffers: {
            bytes: any;
            mb: number;
            gb: number;
        };
    } | null;
};
export default componentAndPageMemory;
declare namespace componentAndPageMemory {
    export { readFileMemoized };
    export { extractUiRefsMemoized };
    export { extractUiRefsFromFileMemoized };
    export { clearComponentAndPageMemory };
    export { getComponentAndPageMemoryStatus };
}
