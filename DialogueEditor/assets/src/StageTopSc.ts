// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DragdropSc from "./DragdropSc";
import StageSc from "./StageSc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageTopSc extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMosueUp, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.active = false;
    }
    private onMosueUp(e: cc.Event.EventMouse) {
        this.node.active = false;
        StageSc.Current.onMouseUp(e);
        
    }
    private onMouseMove(e: cc.Event.EventMouse) {
        StageSc.Current.updateMouseXY(e.getLocationX(),e.getLocationY());
    }
    // update (dt) {}
}
