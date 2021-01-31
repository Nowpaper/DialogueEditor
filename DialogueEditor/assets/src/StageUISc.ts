// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";
import FileNodeUISc from "./FileNodeUISc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageUISc extends cc.Component {

    @property(cc.Node)
    undoButton: cc.Node = null;
    @property(cc.Node)
    redoButton: cc.Node = null;
    @property(cc.Node)
    fileDataUI: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.fileDataUI.active = false;
    }
    /** 操作返回 */
    onClickUndo() {
        CommandSystem.undo();
    }
    /** 重做处理 */
    onClickRedo() {
        CommandSystem.redo();
    }
    update(dt) {
        this.undoButton.opacity = (this.undoButton.getComponent(cc.Button).enabled = CommandSystem.getCanUndo()) ? 255 : 128;
        this.redoButton.opacity = (this.redoButton.getComponent(cc.Button).enabled = CommandSystem.getCanRedo()) ? 255 : 128;
    }
    /** 按钮UI处理 */
    /** 存储 */
    onClickSave() {
        this.fileDataUI.getComponent(FileNodeUISc).show();
    }
    /** 打开 */
    onClickOpen() {
        this.fileDataUI.getComponent(FileNodeUISc).show();
        
    }
}
