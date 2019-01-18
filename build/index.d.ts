/// <reference path="../src/xmlio.d.ts" />
declare type TransformerFunc = (xmlio: any) => any;
export default function XMLioNode(xml: string, transformers?: XMLioTransformer[] | TransformerFunc, exporters?: Exporter[], options?: DomParserOptions): Promise<any>;
export {};
