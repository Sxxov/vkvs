/**
 * @deprecated This class was never a good idea, as there could be multiple
 *   components accessing the class, & the DOM also could have multiple layers
 *   of scrollers. Use either framework-specific workarounds or better
 *   components which handle scroll-swallowing on their own
 */
export class PageScrollUtility {
	public static isPageScrollDisabled = false;

	private static get target() {
		// put in getter to not require `document` during ssr
		return document.body;
	}

	private static targetOverflow = '';
	private static targetWidth = '';

	public static disablePageScroll(): void {
		if (this.isPageScrollDisabled) {
			return;
		}

		this.targetOverflow = this.target.style.overflow;
		this.targetWidth = this.target.style.width;

		this.target.style.overflow = 'hidden';
		this.target.style.width = '100vw';

		this.isPageScrollDisabled = true;
	}

	public static enablePageScroll(): void {
		if (!this.isPageScrollDisabled) {
			return;
		}

		this.target.style.overflow = this.targetOverflow;
		this.target.style.width = this.targetWidth;

		this.isPageScrollDisabled = false;
	}
}
