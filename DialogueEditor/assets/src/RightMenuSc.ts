// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DaiogueNodeSc from "./DaiogueNodeSc";
import { DaiogueSystem } from "./DaiogueSystem";
import StageSc from "./StageSc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RightMenuSc extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isOpen = false;
    private _rightTarget: cc.Node = null;
    openMenu(tips: string, e: cc.Event.EventMouse, target) {
        this.label.string = tips;
        this._rightTarget = target;
        const pt = this.node.parent.convertToNodeSpaceAR(e.getLocation());
        this.node.x = pt.x + this.node.width / 2.5;
        this.node.y = pt.y - this.node.height / 2.5;
        this.isOpen = true;
    }
    closeMenu() {
        this.isOpen = false;
        this.node.y = 2000;
        this._rightTarget = null;
    }
    start() {

    }
    onClickAdd(e: cc.Event.EventMouse) {
        if (this._rightTarget) {
            //有数据说明是一个对话数据块，方便为里面添加
            if (this._rightTarget.getComponent(DaiogueNodeSc)) {

            } else {
                StageSc.Current.addDaiogueNode(e.getLocation());
            }
        }
        this.closeMenu();
    }
    onClickDel() {
        if (StageSc.Current.pickupLine != null) {
            StageSc.Current.disconnectTowDaiogueNode(StageSc.Current.pickupLine.from, StageSc.Current.pickupLine.to);
            StageSc.Current.pickupLine = null;
        } else if (this._rightTarget) {
            //有数据说明是一个对话数据块
            if (this._rightTarget.getComponent(DaiogueNodeSc)) {
                this._rightTarget.getComponent(DaiogueNodeSc).removeFromStage();
            }
            // console.log(DaiogueSystem.daiogueArray);
        }
        this.closeMenu();
    }
    update(dt) {
        if (StageSc.Current) {
            if (!this.isOpen) {
                this.node.opacity = StageSc.Current.pickupLine != null ? 255 : 0;
                if (this.node.opacity >= 255) {
                    const pt = StageSc.Current.node.convertToNodeSpaceAR(cc.v2(StageSc.Current.pickupLine.mouseX, StageSc.Current.pickupLine.mouseY));
                    this.node.x = (pt.x + this.node.width / 2.5) * StageSc.Current.node.scale;
                    this.node.y = (pt.y - this.node.height / 2.5) * StageSc.Current.node.scale;
                    this.label.string = "连接线";
                } else {
                    this.node.y = 2000;
                }
            } else {
                this.node.opacity = 255;
            }
        }
    }
}
