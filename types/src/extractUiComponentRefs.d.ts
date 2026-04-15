export default function extractUiComponentRefs(str: any, { namespace, includeCall, includeDotAccess, }?: {
    namespace?: string | undefined;
    includeCall?: boolean | undefined;
    includeDotAccess?: boolean | undefined;
}): any[];
