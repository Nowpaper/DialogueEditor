// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";
import { DaiogueSystem } from "./DaiogueSystem";
import DialogueSubContnetSc from "./DialogueSubContnetSc";
import { MsgerNames } from "./Msger";
import StageSc from "./StageSc";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DaiogueNodeSc extends cc.Component {
    public Data: DaiogueSystem.DaiogueData;
    @property(cc.Label)
    ID: cc.Label = null;
    @property(cc.EditBox)
    contnet: cc.EditBox = null;
    @property(cc.EditBox)
    title: cc.EditBox = null;
    @property(cc.Node)
    radio_in: cc.Node = null;
    @property(cc.Node)
    radio_next: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Node)
    SubsList: cc.Node = null;
    @property(cc.Prefab)
    subDaioguePrefab: cc.Prefab = null;
    start() {
        this.SubsList.children[0].removeFromParent(true);

        this.radio_in.on(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        this.radio_next.on(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        // 注册子物体的事件
        cc.systemEvent.on(MsgerNames.MS_DialogueSubContnetDEL, this.onDaiogueSubContenetDel, this);
        cc.systemEvent.on(MsgerNames.MS_DialogueSubContnetUP, this.onDaiogueSubContenetUp, this);
        cc.systemEvent.on(MsgerNames.MS_DialogueSubContnetDOWN, this.onDaiogueSubContenetDown, this);
        cc.systemEvent.on(MsgerNames.MS_DialogueSubContnetENDED, this.onDaiogueSubContenetEnded, this);
    }
    /** 设置数据 */
    setData(data: DaiogueSystem.DaiogueData = null) {
        if (!data) {
            this.Data = DaiogueSystem.addDaiogue();
        } else {
            this.Data = data;
        }
        this.ID.string = this.Data.id.toString();
        this.title.string = this.Data.title;
        this.contnet.string = this.Data.contnet;
        for (let item of this.Data.subs) {
            this.addSubContent(item);
        }
        this.node.height = this.Data.subs.length * 112 + 230;
    }
    /** 增加子内容 */
    addSubContent(contnet: string) {
        const subContent = cc.instantiate(this.subDaioguePrefab);
        this.SubsList.addChild(subContent);
        subContent.getComponent(cc.EditBox).string = contnet;
    }
    /** 当点击增加子内容的时候 */
    onClickAddSubContentButton() {
        const redo = () => {
            const sub = cc.instantiate(this.subDaioguePrefab);
            this.SubsList.addChild(sub);
            this.Data.subs.push('');
            this.node.height = this.Data.subs.length * 112 + 230;
        }
        CommandSystem.CreateCommandAdd(
            '添加子内容',
            () => {
                this.SubsList.children[this.SubsList.childrenCount - 1].removeFromParent();
                this.Data.subs.pop();
                this.node.height = this.Data.subs.length * 112 + 230;
            },
            redo
        )
        redo();
    }
    onDestroy() {
        this.radio_in.off(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        this.radio_next.off(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        cc.systemEvent.off(MsgerNames.MS_DialogueSubContnetDEL, this.onDaiogueSubContenetDel, this);
        cc.systemEvent.off(MsgerNames.MS_DialogueSubContnetUP, this.onDaiogueSubContenetUp, this);
        cc.systemEvent.off(MsgerNames.MS_DialogueSubContnetDOWN, this.onDaiogueSubContenetDown, this);
        cc.systemEvent.off(MsgerNames.MS_DialogueSubContnetENDED, this.onDaiogueSubContenetEnded, this);
    }
    removeFromStage() {
        const redo = () => {
            DaiogueSystem.delDaiogue(this.Data);
            this.node.active = false;
        }
        CommandSystem.CreateCommandAdd(
            "删除",
            () => {
                DaiogueSystem.addDaiogue(this.Data);
                this.node.active = true;
            },
            redo
        );
        redo();
    }
    /** 鼠标点击到连接点时候的处理 */
    private onRadioMosueDown(e: cc.Event.EventMouse) {
        if (e.currentTarget) {
            StageSc.Current.contactFromDaiogueNode(this, e.currentTarget, e.currentTarget == this.radio_next);
        }
    }
    /** 链接一个对话为下一个对话内容 */
    contactDaigueNode(daigueNode: DaiogueNodeSc) {
        DaiogueSystem.contactDaiogue(this.Data, daigueNode.Data.id);
        // this.nextDaigueNode.push(daigueNode);
    }
    /** 断开连接对话 */
    discontactDaigueNode(daigueNode: DaiogueNodeSc) {
        if (DaiogueSystem.disconnectDaiogue(this.Data, daigueNode.Data.id)) {
            // this.nextDaigueNode.splice(this.nextDaigueNode.indexOf(daigueNode), 1);
        }
    }
    /** 连接的对话内容 */
    // nextDaigueNode: DaiogueNodeSc[] = [];
    update(dt) {
        this.radio_next.children[0].active = DaiogueSystem.searchConnectFromID(this.Data.id).length > 0;
        this.radio_in.children[0].active = DaiogueSystem.searchConnectToID(this.Data.id).length > 0;
    }
    private updateSubContnetUI() {
        this.node.height = this.Data.subs.length * 112 + 230;
        for (let i = 0; i < this.Data.subs.length; i++) {
            this.SubsList.children[i].getComponent(DialogueSubContnetSc).ContnetString = this.Data.subs[i];
        }
    }
    private onDaiogueSubContenetDel(e: DialogueSubContnetSc) {
        if (!this.checkSubContenetIsSelf(e)) return;
        const node = e.node;
        const zIndex = e.node.getSiblingIndex();
        const redo = () => {
            this.SubsList.removeChild(node);
            this.Data.subs.splice(zIndex, 1);
            this.updateSubContnetUI();
        }
        CommandSystem.CreateCommandAdd(
            '删除子内容',
            () => {
                this.SubsList.insertChild(node, zIndex);
                this.Data.subs.splice(zIndex, 0, e.ContnetString);
                this.updateSubContnetUI();
            },
            redo
        )
        redo();
    }
    private onDaiogueSubContenetDown(e: DialogueSubContnetSc) {
        if (!this.checkSubContenetIsSelf(e)) return;
        const zIndex = e.node.getSiblingIndex();
        const newIndex = zIndex + 1;
        if (newIndex >= this.Data.subs.length) {
            return;
        }
        const redo = () => {
            const newString = this.Data.subs[zIndex];
            this.Data.subs[zIndex] = this.Data.subs[newIndex];
            this.Data.subs[newIndex] = newString;
            this.updateSubContnetUI();
        }

        CommandSystem.CreateCommandAdd(
            '下移子内容',
            () => {
                const newString = this.Data.subs[newIndex];
                this.Data.subs[newIndex] = this.Data.subs[zIndex];
                this.Data.subs[zIndex] = newString;
                this.updateSubContnetUI();
            },
            redo
        )
        redo();
    }
    private onDaiogueSubContenetUp(e: DialogueSubContnetSc) {
        if (!this.checkSubContenetIsSelf(e)) return;
        const zIndex = e.node.getSiblingIndex();
        const newIndex = zIndex - 1;
        if (newIndex < 0) {
            return;
        }
        const redo = () => {
            const newString = this.Data.subs[zIndex];
            this.Data.subs[zIndex] = this.Data.subs[newIndex];
            this.Data.subs[newIndex] = newString;
            this.updateSubContnetUI();
        }

        CommandSystem.CreateCommandAdd(
            '上移子内容',
            () => {
                const newString = this.Data.subs[newIndex];
                this.Data.subs[newIndex] = this.Data.subs[zIndex];
                this.Data.subs[zIndex] = newString;
                this.updateSubContnetUI();
            },
            redo
        )
        redo();
    }
    /** 子内容编辑成功 */
    private onDaiogueSubContenetEnded(e: DialogueSubContnetSc) {
        if (!this.checkSubContenetIsSelf(e)) return;
        const zIndex = e.node.getSiblingIndex();
        const preString = this.Data.subs[zIndex];
        const newString = e.ContnetString;
        const redo = () => {
            this.Data.subs[zIndex] = newString;
            this.updateSubContnetUI();
        }

        CommandSystem.CreateCommandAdd(
            '输入子内容',
            () => {
                this.Data.subs[zIndex] = preString;
                this.updateSubContnetUI();
            },
            redo
        )
        redo();
    }
    private checkSubContenetIsSelf(e: DialogueSubContnetSc): boolean {
        let node = e.node.parent;
        while (node.parent != null) {
            if (node.parent == this.node) {
                return true;
            }
            node = node.parent;
        }
        return false;
    }
    /** 自己的内容编辑成功 */
    onContnetEditingDidEnded() {
        const preString = this.Data.contnet;
        const newString = this.contnet.string;
        const redo = () => {
            this.contnet.string =
                this.Data.contnet = newString;
        }

        CommandSystem.CreateCommandAdd(
            '输入内容',
            () => {
                this.contnet.string =
                    this.Data.contnet = preString;
            },
            redo
        )
        redo();
    }
    /** 自己的标题编辑成功 */
    onTitleEditingDidEnded() {
        const preString = this.Data.title;
        const newString = this.title.string;
        const redo = () => {
            this.title.string =
                this.Data.title = newString;
        }

        CommandSystem.CreateCommandAdd(
            '输入内容',
            () => {
                this.title.string =
                    this.Data.title = preString;
            },
            redo
        )
        redo();
    }
}
