// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import RightMenuSc from "./RightMenuSc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MouseRightButtonSc extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start() {
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
    onDestroy(){
        this.node.off(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    private onMouseUp(e: cc.Event.EventMouse) {
        if (e.getButton() == cc.Event.EventMouse.BUTTON_RIGHT) {
            const rightMenu = cc.find('Canvas/Right Menu');
            if (rightMenu) {
                rightMenu.getComponent(RightMenuSc).openMenu('节点',e, this.node);
            }
        }
    }
    private onMouseMove(e: cc.Event.EventMouse) {
        const rightMenu = cc.find('Canvas/Right Menu');
            if (rightMenu) {
                rightMenu.getComponent(RightMenuSc).closeMenu();
            }
    }
    // update (dt) {}
}
