import DaiogueNodeSc from "./DaiogueNodeSc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomPropertiesUISc extends cc.Component {

    @property(cc.Node)
    itemPrefab: cc.Node = null;
    @property(cc.Node)
    itemsNode: cc.Node = null;
    @property(cc.Node)
    addNode: cc.Node = null;
    start() {
        this.node.active = false;
        this.itemPrefab.parent = null;
    }

    /** 打开自定义属性面板 */
    open(e: DaiogueNodeSc) {
        this.node.active = true;
    }
    close() {
        this.node.active = false;
        this.itemsNode.removeAllChildren();
        this.itemsNode.addChild(this.addNode);
    }
    addCustomPropertie() {
        const item = cc.instantiate(this.itemPrefab);
        this.itemsNode.removeChild(this.addNode);
        this.itemsNode.addChild(item);
        this.itemsNode.addChild(this.addNode);
    }
    delCustomPropertie(s: cc.Event.EventTouch) {
        (s.currentTarget as cc.Node).parent.destroy();
    }
}
