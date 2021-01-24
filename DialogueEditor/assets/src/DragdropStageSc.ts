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
export default class DragdropStageSc extends DragdropSc {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        super.start();
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    protected onMouseMove(e: cc.Event.EventMouse) {
        if (e.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
            for (let node of this.target.children) {
                node.x += e.getDeltaX() / node.parent.scale;
                node.y += e.getDeltaY() / node.parent.scale;
            }
        } else {
            StageSc.Current.updateMouseXYFromBackgroud(e.getLocationX(), e.getLocationY());
        }
    }
    // update (dt) {}
}
