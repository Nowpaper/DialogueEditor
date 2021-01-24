// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragdropSc extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;
    // onLoad () {}

    start() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
        if (!this.target) {
            this.target = this.node;
        }
    }
    protected onMouseDown() {
        this.downX = this.node.x;
        this.downY = this.node.y;
        for (let i = 0; i < this.node.parent.childrenCount; i++) {
            this.node.parent.children[i].zIndex = i;
        }
        this.node.zIndex = this.node.parent.childrenCount + 1;
    }
    protected onMouseMove(e: cc.Event.EventMouse) {
        if (e.getButton() == cc.Event.EventMouse.BUTTON_LEFT) {
            this.target.x += e.getDeltaX() / this.node.parent.scale;
            this.target.y += e.getDeltaY() / this.node.parent.scale;
            e.stopPropagationImmediate();

        }
    }
    private downX: number;
    private downY: number;
    protected onMouseUp() {
        //为移动添加命令处理
        const x = this.node.x;
        const y = this.node.y;
        const dx = this.downX;
        const dy = this.downY;
        const self = this;
        CommandSystem.CreateCommandAdd(
            "移动",
            () => {
                self.node.x = dx;
                self.node.y = dy;
            },
            () => {
                self.node.x = x;
                self.node.y = y;
            });
    }
    // update (dt) {}
}
