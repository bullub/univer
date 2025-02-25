import { BaseComponentProps, Component, createRef, debounce, Input, Select } from '@univerjs/base-ui';
import { FormulaType } from '../../../Basics';
import { FunListILabel, Label } from '../../../Controller/SearchFormulaModalController';
import styles from './index.module.less';

interface IProps extends BaseComponentProps {
    select: Label[];
    funList: FunListILabel;
}

interface IState {
    functionList: FormulaType[] | undefined;
    type: number;
}

export class SearchFormulaContent extends Component<IProps, IState> {
    functionListRef = createRef();

    initialize() {
        this.state = {
            functionList: undefined,
            type: 0,
        };
    }

    changeInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        let { functionList, type } = this.state;
        if (value) {
            functionList = functionList?.filter((item) => {
                if (item.n?.includes(value) || item.d?.includes(value)) {
                    return item;
                }
                return null;
            });
        } else {
            functionList = this.props.funList.children?.filter((item) => item.t === type);
        }

        this.setState({
            functionList,
        });
    }

    selectType(value: string, index: number) {
        const { funList } = this.props;
        const functionList = funList.children?.filter((item) => item.t === index);
        this.setState(
            {
                functionList: this.getFunctionList(functionList ?? []),
                type: index,
            },
            () => {
                this.highLightLi(0);
            }
        );
    }

    componentDidMount() {
        const functionList = this.getFunctionList(this.props.funList.children?.filter((item) => item.t === 0) ?? []);
        this.setState(
            {
                functionList,
                type: 0,
            },
            () => {
                this.highLightLi(0);
            }
        );
    }

    highLightLi(index: number) {
        const item = this.functionListRef.current.querySelectorAll(`.${styles.functionListsItem}`);
        for (let i = 0; i < item.length; i++) {
            item[i].classList.remove(styles.functionListsItemActive);
        }
        item[index].classList.add(styles.functionListsItemActive);
        item[index].click();
    }

    handleClick(item: FormulaType, index: number) {
        const { funList } = this.props;
        this.highLightLi(index);
        funList.onClick(item);
    }

    /**
     * 国际化
     */
    getSelect() {
        const { select } = this.props;
        const arr = [];
        for (let i = 0; i < select.length; i++) {
            arr.push({
                label: this.getLocale(select[i].label),
            });
        }
        return arr;
    }

    getFunctionList(list: FormulaType[]) {
        const functionList = JSON.parse(JSON.stringify(list));
        for (let i = 0; i < functionList.length; i++) {
            for (let k in functionList[i]) {
                if (functionList[i][k] instanceof Array) {
                    functionList[i][k] = this.getFunctionList(functionList[i][k]);
                } else if (typeof functionList[i][k] === 'string') {
                    functionList[i][k] = this.getLocale(functionList[i][k]);
                }
            }
        }
        return functionList;
    }

    render() {
        const { functionList } = this.state;

        return (
            <div className={styles.functionModal}>
                <div className={styles.functionSearch}>
                    <div className={styles.functionLabel}>{this.getLocale('formula.formulaMore.findFunctionTitle')}</div>
                    <Input placeholder={this.getLocale('formula.formulaMore.tipInputFunctionName')} onChange={debounce(this.changeInput.bind(this), 50)} />
                </div>
                <div className={styles.functionSelect}>
                    <div className={styles.functionLabel}>{this.getLocale('formula.formulaMore.selectCategory')}</div>
                    <div className={styles.functionSelector}>
                        <Select onClick={this.selectType.bind(this)} type={0} children={this.getSelect()} hideSelectedIcon={true}></Select>
                    </div>
                </div>
                <div className={styles.functionList} ref={this.functionListRef}>
                    <div className={styles.functionLabel}>{this.getLocale('formula.formulaMore.selectFunctionTitle')}</div>
                    <ul className={styles.functionLists}>
                        {functionList?.map((item, index) => (
                            <li className={`${styles.functionListsItem}`} onClick={() => this.handleClick(item, index)}>
                                <div className={styles.functionListsItemName}>{item.n}</div>
                                <div className={styles.functionListsItemDetail}>{item.d}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
