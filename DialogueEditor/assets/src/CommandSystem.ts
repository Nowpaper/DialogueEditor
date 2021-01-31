
/** 通过指令系统可以作撤销和重做 */

export module CommandSystem {
    const CommandArray: Command[] = [];
    let undoCount = 0;
    export function getCanUndo() { return undoCount < CommandArray.length; }
    export function getCanRedo() { return undoCount > 0; }
    export function addCommand(command: Command): Command {
        CommandArray.splice(CommandArray.length - undoCount, undoCount);
        CommandArray.push(command);
        undoCount = 0;
        return command;
    }
    /** 清理掉所有的指令数据 */
    export function clearCommands() {
        undoCount = 0;
        CommandArray.splice(0, CommandArray.length);
    }
    export function undo() {
        undoCount += 1;
        CommandArray[CommandArray.length - undoCount].undo();
    }
    export function redo() {
        if (undoCount > 0) {
            CommandArray[CommandArray.length - undoCount].redo();
            undoCount -= 1;
        }
    }
    export function CreateCommandAdd(tag: string, undo: () => void, redo: () => void): Command {
        return addCommand(CreateCommand(tag, undo, redo));
    }
    export function CreateCommand(tag: string, undo: () => void, redo: () => void): Command {
        return { tag: tag, redo: redo, undo: undo };
    }
    /** 标准的命令基类 */
    class Command {
        tag: string;
        undo() {

        };
        redo() {

        };
    }
}