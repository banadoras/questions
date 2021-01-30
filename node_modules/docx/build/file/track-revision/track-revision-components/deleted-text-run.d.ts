import { XmlComponent } from "../../../file/xml-components";
import { FootnoteReferenceRun, IRunOptions, IRunPropertiesOptions } from "../../index";
import { Begin, End, Separate } from "../../paragraph/run/field";
import { PageNumber } from "../../paragraph/run/run";
import { IChangedAttributesProperties } from "../track-revision";
interface IDeletedRunOptions extends IRunPropertiesOptions, IChangedAttributesProperties {
    readonly children?: (Begin | Separate | End | PageNumber | FootnoteReferenceRun | string)[];
    readonly text?: string;
}
export declare class DeletedTextRun extends XmlComponent {
    protected readonly deletedTextRunWrapper: DeletedTextRunWrapper;
    constructor(options: IDeletedRunOptions);
    break(): DeletedTextRun;
}
declare class DeletedTextRunWrapper extends XmlComponent {
    constructor(options: IRunOptions);
    break(): void;
}
export {};
