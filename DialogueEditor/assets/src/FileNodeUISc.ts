import { CommandSystem } from "./CommandSystem";
import DaiogueNodeSc from "./DaiogueNodeSc";
import { DaiogueSystem } from "./DaiogueSystem";
import StageSc from "./StageSc";


const { ccclass, property } = cc._decorator;
/** 这个解决方案仅仅是临时性的，考虑文件处理需要系统支持,另外处理 */
@ccclass
export default class FileNodeUISc extends cc.Component {


    @property(cc.EditBox)
    fileData: cc.EditBox = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    show() {
        this.node.active = true;
        const array = StageSc.Current.getComponentsInChildren(DaiogueNodeSc);
        const data = DaiogueSystem.getData();
        const nodesPos = [];
        for (let item of array) {
            nodesPos.push({
                id: item.Data.id, posX: item.node.x, posY: item.node.y
            });
        }
        data.nodesPos = nodesPos;
        this.fileData.string = JSON.stringify(data);
    }
    onClickOpen() {

    }
    onClickSave() {

    }
    onClickClose() {

        this.node.active = false;
    }
    /** 将数据应用到当前场景 */
    onClickHandle() {
        //先进行判断
        const jsonstr = this.fileData.string;
        let data: { nodesPos: { posX, posY, id }[] };
        if ((data = DaiogueSystem.openData(jsonstr)) != null) {
            //执行同步操作
            CommandSystem.clearCommands();
            StageSc.Current.node.removeAllChildren(true);
            for (let item of data.nodesPos) {
                const node = cc.instantiate(StageSc.Current.daioguePrefab);
                node.getComponent(DaiogueNodeSc).setData(DaiogueSystem.getDaiogueFromID(item.id));
                node.x = item.posX;
                node.y = item.posY;
                StageSc.Current.node.addChild(node);
            }
            this.onClickClose();
        }
    }
    // update (dt) {}
}
