import { Thing } from '../../../core/blocks/thing/Thing';
import type { Css } from '../../../resources/utilities';
import { v4 as uuid } from 'uuid';

export interface IDropdown extends Required<IDropdownParameters> {}

interface IDropdownParameters {
	text: string;
	svg: string;
	label?: boolean;
	id?: string;
	backgroundColour?: TCss;
	hoverBackgroundColour?: TCss;
	rippleColour?: TCss;
	textColour?: TCss;
}

export class Dropdown extends Thing<IDropdownParameters>()(
	class {
		label = false;
		id = uuid();
		backgroundColour = '--colour-background-secondary';
		hoverBackgroundColour = '--colour-background-primary';
		rippleColour = '--colour-background-primary';
		textColour = '--colour-text-primary';
	},
) {}
