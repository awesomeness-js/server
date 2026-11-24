export default function returnsToOutputSchema(returns?: object): {
    type: any;
    format: any;
    contentEncoding: string;
    enum: any;
    examples: any;
    properties: {};
    required: string[];
    items: /*elided*/ any;
} | null;
