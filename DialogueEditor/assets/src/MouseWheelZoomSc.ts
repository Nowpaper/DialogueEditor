// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MouseWheelZoomSc extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }
    onMouseWheel(e: cc.Event.EventMouse) {
        const value = e.getScrollY();
        cc.Tween.stopAllByTarget(this.target);
        let scale = this.target.scale + value / 1200 * 2;
        if (scale <= 0.1) {
            scale = 0.1;
        }
        cc.tween(this.target).to(0.1, { scale: scale }).start();
    }

    // update (dt) {}
}
