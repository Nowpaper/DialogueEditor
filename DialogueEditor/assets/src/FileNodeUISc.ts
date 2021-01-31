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

    @property(cc.EditBox)
    fileName: cc.EditBox = null;


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
        this.fileName.string = "DE_" + Date.now();
    }
    onClickOpen() {
        const upload = document.createElement('input');
        upload.type = 'file';
        document.body.appendChild(upload);
        upload.style.display = 'none';
        upload.onchange = () => {
            // uploadOnChange
            const file = upload.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.fileData.string = reader.result as string;
            }
            reader.readAsText(file);
        };
        upload.click();
    }
    onClickSave() {
        const str = this.fileData.string;
        const data = new Blob([str], { type: "text/plain;charset=UTF-8" });
        const downloadurl = window.URL.createObjectURL(data);
        const anchor = document.createElement("a");
        anchor.href = downloadurl;
        anchor.download = this.fileName.string + ".json";
        anchor.click();
        window.URL.revokeObjectURL(<any>data);
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
