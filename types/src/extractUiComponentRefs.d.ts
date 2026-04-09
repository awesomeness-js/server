export default function extractUiComponentRefs(str: any, { namespace, includeCall, includeDotAccess, }?: {
    namespace?: string;
    includeCall?: boolean;
    includeDotAccess?: boolean;
}): any[];
