import { Component, Input } from '@univerjs/base-ui';

interface IProps {
    prefix: string;
    suffix: string;
    onKeyUp?: (e: Event) => void;
    getPlaceholder?: () => string;
    getInputValue?: () => string;
}

export class RightMenuInput extends Component<IProps> {
    handleClick(e: Event) {
        e.stopPropagation();
    }

    handleKeyUp(e: Event) {
        const { onKeyUp } = this.props;
        onKeyUp?.(e);
    }

    render() {
        const { prefix, suffix, getPlaceholder, getInputValue } = this.props;
        return (
            <div>
                {this.getLabel(prefix)}
                <Input onChange={this.handleKeyUp.bind(this)} type="number" placeholder={getPlaceholder?.()} value={getInputValue?.()} onClick={this.handleClick}></Input>
                {this.getLabel(suffix)}
            </div>
        );
    }
}
