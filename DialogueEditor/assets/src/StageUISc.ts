// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageUISc extends cc.Component {

    @property(cc.Node)
    undoButton: cc.Node = null;
    @property(cc.Node)
    redoButton: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    onClickUndo() {
        CommandSystem.undo();
    }
    onClickRedo() {
        CommandSystem.redo();
    }
    update(dt) {
        this.undoButton.opacity = (this.undoButton.getComponent(cc.Button).enabled = CommandSystem.getCanUndo()) ? 255 : 128;
        this.redoButton.opacity = (this.redoButton.getComponent(cc.Button).enabled = CommandSystem.getCanRedo()) ? 255 : 128;
    }
}
