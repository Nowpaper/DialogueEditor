// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MsgerNames } from "./Msger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogueSubContnetSc extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    /** 获取内容 */
    get ContnetString(): string {
        return this.getComponent(cc.EditBox).string;
    }
    set ContnetString(v: string) {
        this.getComponent(cc.EditBox).string = v;
    }
    onClickDel() {
        cc.systemEvent.emit(MsgerNames.MS_DialogueSubContnetDEL, this);
    }
    onClickUp() {
        cc.systemEvent.emit(MsgerNames.MS_DialogueSubContnetUP, this);
    }
    onClickDown() {
        cc.systemEvent.emit(MsgerNames.MS_DialogueSubContnetDOWN, this);
    }
    onEditingDidEnded() {
        cc.systemEvent.emit(MsgerNames.MS_DialogueSubContnetENDED, this);
    }
    // update (dt) {}
}
