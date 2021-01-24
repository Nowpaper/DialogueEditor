// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";
import { DaiogueSystem } from "./DaiogueSystem";
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
    private subDaioguePrefab: cc.Node = null;
    start() {
        this.subDaioguePrefab = this.SubsList.children[0];
        this.subDaioguePrefab.removeFromParent();

        this.radio_in.on(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        this.radio_next.on(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
    }
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
        this.node.height = this.Data.subs.length * 100 + 230;
    }
    addSubContent(contnet: string) {
        const subContent = cc.instantiate(this.subDaioguePrefab);
        this.SubsList.addChild(subContent);
        subContent.getComponent(cc.EditBox).string = contnet;
    }
    onDestroy() {
        this.radio_in.off(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
        this.radio_next.off(cc.Node.EventType.MOUSE_DOWN, this.onRadioMosueDown, this);
    }
    removeFromStage() {
        const redo = ()=>{
            DaiogueSystem.delDaiogue(this.Data);
            this.node.active = false;
        }
        CommandSystem.CreateCommandAdd(
            "删除",
            ()=>{
                DaiogueSystem.addDaiogue(this.Data);
                this.node.active = true;
            },
            redo
        );
        redo();
    }
    /** 鼠标点击时候的处理 */
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
}
