// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CommandSystem } from "./CommandSystem";
import DaiogueNodeSc from "./DaiogueNodeSc";
import { DaiogueSystem } from "./DaiogueSystem";
import DragdropSc from "./DragdropSc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageSc extends cc.Component {

    public static Current: StageSc = null;
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property(cc.Node)
    stageTopLayer: cc.Node = null;
    @property(cc.Prefab)
    daioguePrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

        if (!this.graphics) {
            this.graphics = this.getComponent(cc.Graphics);
        }
        StageSc.Current = this;
        const array = this.node.getComponentsInChildren(DaiogueNodeSc);
        for (let sc of array) {
            sc.setData();
        }
        // this.contactTowDaiogueNode(array[0], array[1]);
        // this.contactTowDaiogueNode(array[2], array[1]);
    }
    private mouseX: number = null;
    private mouseY: number = null;
    updateMouseXY(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
    /** 从背景中来的鼠标移动坐标，主要是为了处理空白处的对象操作，比如线 */
    updateMouseXYFromBackgroud(x, y) {
        const pt = cc.v2(x, y);
        for (let line of DaiogueSystem.contactArray) {
            const fromNode = this.getDaiogueNodeFromId(line.from);
            const toNode = this.getDaiogueNodeFromId(line.to);
            let wp1 = fromNode.radio_next.parent.convertToWorldSpaceAR(cc.v2(fromNode.radio_next.x, fromNode.radio_next.y));
            let wp2 = toNode.radio_in.parent.convertToWorldSpaceAR(cc.v2(toNode.radio_in.x, toNode.radio_in.y));
            let sub = wp2.sub(wp1).normalizeSelf().mulSelf(5);
            sub = sub.rotateSelf(Math.PI / 2);
            const polygonPos = [wp1.add(sub), wp2.add(sub)];
            sub = sub.rotateSelf(Math.PI);
            polygonPos.push(wp2.add(sub), wp1.add(sub));
            if (cc.Intersection.pointInPolygon(pt, polygonPos)) {
                // console.log(pt);
                this.pickupLine = { from: fromNode, to: toNode, mouseX: x, mouseY: y };
                return;
            }
        }

        // for (let sc of array) {
        //     for (let next of sc.nextDaigueNode) {
        //         let wp1 = sc.radio_next.parent.convertToWorldSpaceAR(cc.v2(sc.radio_next.x, sc.radio_next.y));
        //         let wp2 = next.radio_in.parent.convertToWorldSpaceAR(cc.v2(sc.radio_in.x, sc.radio_in.y));
        //         let sub = wp2.sub(wp1).normalizeSelf().mulSelf(5);
        //         sub = sub.rotateSelf(Math.PI / 2);
        //         const polygonPos = [wp1.add(sub), wp2.add(sub)];
        //         sub = sub.rotateSelf(Math.PI);
        //         polygonPos.push(wp2.add(sub), wp1.add(sub));
        //         if (cc.Intersection.pointInPolygon(pt, polygonPos)) {
        //             // console.log(pt);
        //             this.pickupLine = { from: sc, to: next, mouseX: x, mouseY: y };
        //             return;
        //         }
        //     }
        // }
        this.pickupLine = null;
    }
    onMouseUp(e: cc.Event.EventMouse) {

        //由于阻挡机制得问题，所有的触发点遍历一下，这种做法似乎不太好
        const array = this.node.getComponentsInChildren(DaiogueNodeSc);
        for (let sc of array) {
            if (sc.radio_next.getBoundingBoxToWorld().contains(e.getLocation())) {
                this.contactToDaiogueNode(sc, true);
                break;
            } else if (sc.radio_in.getBoundingBoxToWorld().contains(e.getLocation())) {
                this.contactToDaiogueNode(sc, false);
                break;
            }
        }
        this.contactFrom = null;
        this.mouseX = null;
        this.mouseY = null;
    }
    /** 拾取线才会处理的数据结构 */
    pickupLine: {
        from: DaiogueNodeSc, to: DaiogueNodeSc, mouseX, mouseY
    } = null;
    update(dt) {
        // 之前应该绘制所有的线路
        this.graphics.clear();
        for (let line of DaiogueSystem.contactArray) {
            const fromNode = this.getDaiogueNodeFromId(line.from);
            const toNode = this.getDaiogueNodeFromId(line.to);
            const beginPos = this.converToSelf(fromNode.radio_next);
            this.graphics.moveTo(beginPos.x, beginPos.y);
            const endPos = this.converToSelf(toNode.radio_in);
            this.graphics.lineTo(endPos.x, endPos.y);
        }
        // const array = this.node.getComponentsInChildren(DaiogueNodeSc);
        // for (let sc of array) {
        //     if (sc.nextDaigueNode.length > 0) {
        //         for (let next of sc.nextDaigueNode) {
        //             const beginPos = this.converToSelf(sc.radio_next);
        //             this.graphics.moveTo(beginPos.x, beginPos.y);
        //             const endPos = this.converToSelf(next.radio_in);
        //             this.graphics.lineTo(endPos.x, endPos.y);
        //             // this.graphics.quadraticCurveTo(endPos.x + (endPos.x - beginPos.x < 0 ? 150 : -150), endPos.y + (endPos.y - beginPos.y < 0 ? 50 : -50), endPos.x, endPos.y);
        //             // this.graphics.bezierCurveTo(endPos.x + (endPos.x - beginPos.x < 0 ? 50 : -50), endPos.y + (endPos.y - beginPos.y < 0 ? 50 : -50), endPos.x + (endPos.x - beginPos.x < 0 ? 50 : -50), endPos.y + (endPos.y - beginPos.y < 0 ? 50 : -50), endPos.x, endPos.y);
        //         }
        //     }
        // }
        if (this.contactFrom && (this.mouseX != null && this.mouseY != null)) {
            let pt = this.contactFrom.from.parent.convertToWorldSpaceAR(cc.v2(this.contactFrom.from.x, this.contactFrom.from.y));
            pt = this.node.convertToNodeSpaceAR(pt);
            this.graphics.moveTo(pt.x, pt.y);
            let pt2 = this.node.convertToNodeSpaceAR(cc.v2(this.mouseX, this.mouseY));
            this.graphics.lineTo(pt2.x, pt2.y);
        }
        this.graphics.stroke();
        //要对特殊的情况加强绘制
        // 线拾取的时候
        if (this.pickupLine) {
            const beginPos = this.converToSelf(this.pickupLine.from.radio_next);
            this.graphics.moveTo(beginPos.x, beginPos.y);
            const endPos = this.converToSelf(this.pickupLine.to.radio_in);
            this.graphics.lineTo(endPos.x, endPos.y);
            const saveColor = this.graphics.strokeColor;
            this.graphics.strokeColor = cc.color(0xbe, 0xd7, 0x42, 0xff);
            this.graphics.stroke();
            this.graphics.strokeColor = saveColor;
        }
    }
    /** 点击产生连接时候的数据存储 */
    private contactFrom: {
        daiogueNode: DaiogueNodeSc, from: cc.Node, isNext: boolean
    } = null;
    /** 从一个连接点开始启动 */
    contactFromDaiogueNode(daiogueNode: DaiogueNodeSc, from: cc.Node, isnext) {
        this.contactFrom = { daiogueNode: daiogueNode, from: from, isNext: isnext };
        this.stageTopLayer.active = true;
    }
    /** 到达一个连接点 */
    contactToDaiogueNode(daiogueNode: DaiogueNodeSc, isnext: boolean) {
        // 同一个对话数据块不能被连接
        if (daiogueNode.Data.id != this.contactFrom.daiogueNode.Data.id) {
            // 同类型的连接点不能被连接
            if (this.contactFrom.isNext != isnext) {
                if (this.contactFrom.isNext) {
                    this.contactTowDaiogueNode(this.contactFrom.daiogueNode, daiogueNode);
                } else {
                    this.contactTowDaiogueNode(daiogueNode, this.contactFrom.daiogueNode);
                }
            }
        }
        this.contactFrom = null;
    }
    /** 连接两个对话数据块 */
    contactTowDaiogueNode(daiogueNode: DaiogueNodeSc, to: DaiogueNodeSc, iscommand = false) {
        if (daiogueNode.Data.id != to.Data.id) {
            const redo = () => {
                daiogueNode.contactDaigueNode(to);
            }
            if (!iscommand) {
                CommandSystem.CreateCommandAdd(
                    "连接",
                    () => {
                        this.disconnectTowDaiogueNode(daiogueNode, to, true);
                    }, redo
                )
            }
            redo();
        }
    }
    /** 断开两个对话 */
    disconnectTowDaiogueNode(one: DaiogueNodeSc, two: DaiogueNodeSc, iscommand = false) {
        if (one && two) {

            const redo = () => {
                one.discontactDaigueNode(two);
            }
            if (!iscommand) {
                CommandSystem.CreateCommandAdd(
                    "断开",
                    () => {
                        this.contactTowDaiogueNode(one, two, true);
                    }, redo
                )
            }
            redo();
        }
    }
    /** 转换一个Node的坐标到本舞台的坐标上 */
    private converToSelf(node: cc.Node): cc.Vec2 {
        const pt = node.parent.convertToWorldSpaceAR(cc.v2(node.x, node.y));
        return this.node.convertToNodeSpaceAR(pt);
    }
    /** 添加一个数据块到指定的位置上 */
    public addDaiogueNode(pos: cc.Vec2) {
        const pt = this.node.convertToNodeSpaceAR(pos);
        const addNode = cc.instantiate(this.daioguePrefab);
        this.node.addChild(addNode);
        addNode.x = pt.x;
        addNode.y = pt.y;
        addNode.getComponent(DaiogueNodeSc).setData();

        //添加指令处理
        const self = this;
        CommandSystem.addCommand({
            tag: "添加对话",
            redo: () => {
                // self.node.addChild(addNode);
                addNode.active = true;
                DaiogueSystem.addDaiogue(addNode.getComponent(DaiogueNodeSc).Data);
            },
            undo: () => {
                addNode.active = false;
                DaiogueSystem.delDaiogue(addNode.getComponent(DaiogueNodeSc).Data);
            }
        })
    }
    /** 通过ID找到一个对话节点 */
    public getDaiogueNodeFromId(id: number): DaiogueNodeSc {
        const array = this.node.getComponentsInChildren(DaiogueNodeSc);
        return array.find((value) => {
            return value.Data.id == id;
        });
    }
}