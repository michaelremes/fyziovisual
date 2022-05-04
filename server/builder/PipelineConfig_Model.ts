type Node = {
    id: string;
    type: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    data: any;
    targetId: string;
    sourceId: string;
}
type Edge = {
    id: string;
    type: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    data: any;
    animated: boolean;
}




export { Node, Edge };