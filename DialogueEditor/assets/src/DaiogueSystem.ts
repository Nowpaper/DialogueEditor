export module DaiogueSystem {
    /** 对话基础数据类 */
    export class DaiogueData {
        /** ID */
        id: number;
        /** 标题 */
        title: string = '';
        /** 内容 */
        contnet: string = '';
        /** 子对话数据,列表数据格式 */
        subs: string[] = [];
        custom: DaiogueCustomData = null;
    }
    /** 连接线的数据 */
    class ContactData {
        from: number;
        to: number;
    }
    /** 对话自定义数据类 */
    export class DaiogueCustomData {
        data;
        events;
    }
    /** 对话保存组 */
    export const daiogueArray: DaiogueData[] = [];
    export const contactArray: ContactData[] = []
    let idCount = 0;
    export function getDaiogueFromID(id: number) {
        const find = daiogueArray.filter((value) => {
            return value.id == id;
        });
        if (find.length >= 1) {
            return find.shift();
        }
        return null;
    }
    /** 添加一个对话数据,data可能是已经存在的数据,理论上这玩意不能在外部创建 */
    export function addDaiogue(data = null): DaiogueData {
        if(data){
            daiogueArray.push(data);   
            return data;
        }
        const daiogueData = new DaiogueData();
        daiogueArray.push(daiogueData);
        daiogueData.id = (idCount += 1);
        return daiogueData;
    }
    /** 删除一个对话数据 */
    export function delDaiogue(data: DaiogueData): boolean {
        const index = daiogueArray.indexOf(data);
        if (index >= 0) {
            daiogueArray.splice(index, 1);
            //应该把所有链接全部移除，移除了的话就意味着不能恢复了，所以保存的时候应该处理是否存在连接
            // const arr = contactArray.filter((value) => {
            //     return value.from == data.id || value.to == data.id;
            // })
            // for (let a of arr) {
            //     contactArray.splice(arr.indexOf(a), 1);
            // }
        }
        return false;
    }
    /** 克隆一个对话数据 */
    export function cloneDaiogue(data: DaiogueData): DaiogueData {
        const clone: DaiogueData = JSON.parse(JSON.stringify(data));
        daiogueArray.push(clone);
        clone.id = (idCount += 1);
        return clone;
    }
    /** 联系两个数据 */
    export function contactDaiogue(daiogue: DaiogueData, contactId: number) {
        const contactIndex = contactArray.findIndex((value) => {
            return value.from == daiogue.id && value.to == contactId;
        });
        if (contactIndex >= 0) {
            return;
        }
        const a = new ContactData();
        a.from = daiogue.id;
        a.to = contactId;
        contactArray.push(a);
    }
    /** 对话断开连结 */
    export function disconnectDaiogue(daiogue: DaiogueData, disconnectId: number) {
        const contactIndex = contactArray.findIndex((value) => {
            return value.from == daiogue.id && value.to == disconnectId;
        });
        if (contactIndex >= 0) {
            contactArray.splice(contactIndex, 1);
            return true;
        } else {
            return false;
        }
    }
    /** 添加子对话 */
    export function addSubDaiogue(owneId: number, contnet: string) {
        const daiogue = getDaiogueFromID(owneId);
        if (daiogue && contnet) {
            daiogue.subs.push(contnet);
            return true;
        }
        return false;
    }
    /** 移除子对话 */
    export function removeSubDaiogue(owneId: number, contnet: string) {
        const daiogue = getDaiogueFromID(owneId);
        if (daiogue) {
            const index = daiogue.subs.findIndex((value) => {
                return value == contnet;
            });
            if (index >= 0) {
                daiogue.subs.splice(index, 1)
            }
            return true;
        }
        return false;
    }
    /** 调整子对话内容的位置，如果不存在则插入到指定位置 */
    export function moveSubDaiogue(owneId: number, contnet: string, index: number) {
        const daiogue = getDaiogueFromID(owneId);
        if (daiogue) {
            removeSubDaiogue(owneId, contnet);
            daiogue.subs.splice(index, 0, contnet);
        }
    }
    /** 查找一个对话ID 被多少指定连接 */
    export function searchConnectToID(toId: number): ContactData[] {
        return contactArray.filter((value) => {
            return value.to == toId;
        });
    }
    /** 查找一个对话ID 指向了多少其他数据 */
    export function searchConnectFromID(fromId: number): ContactData[] {
        return contactArray.filter((value) => {
            return value.from == fromId;
        });
    }
}