import { Bezier } from '../../../resources/utilities/bezier/Bezier';
import type { Item, TItemOptions } from '../../blocks/item/Item';
import type { AbstractAnimation } from '../animations/AbstractAnimation';
import { AnimationAdapter } from './AnimationAdapter';

export class EasingAdapter extends AnimationAdapter {
	private bezierUtility = new Bezier(1, 1, 1, 1);

	public ease(...easing: ConstructorParameters<typeof Bezier>) {
		this.bezierUtility = new Bezier(...easing);

		return this;
	}

	protected override onFrame(frame: number, length: number) {
		super.onFrame(this.bezierUtility.at(frame / length) * length, length);
	}

	public static override from<
		T extends typeof AbstractAnimation,
		U extends typeof Item = typeof EasingAdapter,
	>(options: TItemOptions<T>): InstanceType<U> {
		return super.from(options);
	}
}
