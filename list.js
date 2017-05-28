init();

function init() {
    var i;

    for (i = 0; i < headsPoolSize; i++) {
        headsPool[i] = {};
        headsPool[i].index = i;
        headsPool[i].len = null;
        headsPool[i].currFlag = null;
        headsPool[i].head = null;
        headsPool[i].tail = null;
        headsPool[i].curr = null;
        headsPool[i].next = null;
    }

    for (i = 0; i < nodesPollSize; i++) {
        nodesPool[i] = {};
        nodesPool[i].index= i;
        nodesPool[i].val = null;
        nodesPool[i].prev = null;
        nodesPool[i].next = null;
    }
}

function ListCreate() {
    var list = allocateList();

    if (list != null) {
        updateList(list, 0, -1, null, null, null);
    } else {
        console.log("Failure: All heads are exhausted.");
    }

    return list;
}

function  ListCount(list) {
    return list.len;
}

function ListFirst(list) {
    list.curr = list.head;
    return ListCurr(list);
}

function ListLast(list) {
    list.curr = list.tail;
    return ListCurr(list);
}

function ListNext(list) {
    if (list.curr == null) {
        /* If the current pointer points before the head of the list */
        if (list.currFlag == -1) {
            return ListFirst(list);
        }

        /* If the current pointer points beyond the tail of the list */
        else if (list.currFlag == 1) {
            return null;
        }
    }

    list.curr = list.curr.next;
    var res = ListCurr(list);

    /* set flag when the current pointer goes beyond the tail */
    if (res == null) {
        list.currFlag = 1;
    }

    return res;
}

function ListPrev(list) {
    if (list.curr == null) {
        /* If the current pointer points beyond the tail of the list */
        if (list.currFlag == 1) {
            return ListLast(list);
        }

        /* If the current pointer points before the head of the list */
        else if (list.currFlag == -1){
            return null;
        }
    }

    list.curr = list.curr.prev;
    var res = ListCurr(list);

    /* set flag when the current pointer goes before the head */
    if (res == null) {
        list.currFlag = -1;
    }

    return res;
}

function ListCurr(list) {
    if (list.curr != null) {
        return list.curr.val;
    } else {
        return null;
    }
}

function ListAdd(list, item) {
    /* Success case 1 */
    if (list.curr == null) {
        /* if the current pointer is before the head */
        if (list.currFlag == -1) {
            return ListPrepend(list, item);
        }
        /* if the current pointer is beyond the tail */
        else if (list.currFlag == 1){
            return ListAppend(list, item);
        }
    }

    /* Try allocating space for new list node */
    var temp = list.curr;
    list.curr = allocateNode();

    /* Check if nodes are exhausted */
    if (list.curr == null) {
        console.log("Failure: All nodes are exhausted.");
        return -1;
    } else {
        updateListNode(list.curr, item, temp, temp.next);

        /* Check if current pointer is at the tail */
        if (temp.next == null) {
            list.tail = list.curr;
        } else {
            temp.next.prev = list.curr;
        }

        temp.next = list.curr;
        list.len++;
        return 0;
    }
}

function ListInsert(list, item) {
    /* Success case 1 */
    if (list.curr == null) {
        /* if the current pointer is before the head */
        if (list.currFlag == -1) {
            return ListPrepend(list, item);
        }
        /* if the current pointer is beyond the tail */
        else if (list.currFlag == 1){
            return ListAppend(list, item);
        }
    }

    /* Try allocating space for new list node */
    var temp = list.curr;
    list.curr = allocateNode();

    /* Check if nodes are exhausted */
    if (list.curr == null) {
        return -1;
    } else {
        updateListNode(list.curr, item, temp.prev, temp);

        /* Check if current pointer is at the head */
        if (temp.prev != null) {
            temp.prev.next = list.curr;
        } else {
            list.head = list.curr;
        }

        temp.prev = list.curr;
        list.len++;
        return 0;
    }
}

function ListAppend(list, item) {
    /* Try allocating space for new list node */
    list.curr = allocateNode();

    /* Check if nodes are exhausted */
    if (list.curr == null) {
        return -1;
    } else {
        /* Check if the list is empty */
        if (list.len == 0) {
            updateListNode(list.curr, item, null, null);
            updateList(list, list.len + 1, 0, list.curr, list.curr, list.curr);
            return 0;
        } else {
            updateListNode(list.curr, item, list.tail, null);
            list.tail.next = list.curr;
            list.tail = list.curr;
            list.len++;
            return 0;
        }
    }
}

function ListPrepend(list, item) {
    /* Try allocating space for new list node */
    list.curr = allocateNode();

    /* Check if nodes are exhausted */
    if (list.curr == null) {
        return -1;
    } else {
        /* Check if the list is empty */
        if (list.len == 0) {
            updateListNode(list.curr, item, null, null);
            updateList(list, list.len + 1, 0, list.curr, list.curr, list.curr);
            return 0;
        } else {
            updateListNode(list.curr, item, null, list.head);
            list.head.prev = list.curr;
            list.head = list.curr;
            list.len++;
            return 0;
        }
    }
}

function allocateList() {
    if (freeHeadList == null) {
        if (freeHeadIndex < headsPoolSize) {
            setHeadStatus(freeHeadIndex, 1);
            return headsPool[freeHeadIndex++];
        } else {
            return null; // No brand new list left
        }
    } else {
        var listFree = freeHeadList;
        freeHeadList = freeHeadList.next;
        return listFree;
    }
}

function updateList(list, len, currFlag, head, tail, curr) {
    list.len = len;
    list.currFlag = currFlag;
    list.head = head;
    list.tail = tail;
    list.curr = curr;
}

function freeList(list) {
    list.next = null;

    setHeadStatus(list.index, 0);

    if (freeHeadList == null) {
        freeHeadList = list;
    } else {
        list.next = freeHeadList;
        freeHeadList = list;
    }
}

function allocateNode() {
    if (freeNodeList == null) {
        if (freeNodeIndex < nodesPollSize) {
            setNodeStatus(freeNodeIndex, 1);
            return nodesPool[freeNodeIndex++];
        } else {
            return null;
        }
    } else {
        var nodeFree = freeNodeList;
        setNodeStatus(nodeFree.index, 1);
        freeNodeList = freeNodeList.next;
        return nodeFree;
    }
}

function updateListNode(listNode, item, prev, next) {
    listNode.val = item;
    listNode.prev = prev;
    listNode.next = next;
}

function freeNode(listNode) {
    listNode.prev = null;
    listNode.val = null;
    listNode.next = null;

    setNodeStatus(listNode.index, 0);

    if (freeNodeList == null) {
        freeNodeList = listNode;
    } else {
        listNode.next = freeNodeList;
        freeNodeList = listNode;
    }
}

function ListRemove(list) {

    /* If current list pointer points out of the list */
    if (list.curr == null) {
        return null;
    } else {
        var temp = list.curr;
        var item = temp.val;

        /* Current list pointer points at the only node in the list */
        if (list.curr == list.head && list.curr == list.tail) {
            list.head = null;
            list.tail = null;
            list.curr = null;
            list.currFlag = -1;
        }

        /* Current list pointer points at head */
        else if (list.curr == list.head) {
            temp.next.prev = null;
            list.head = temp.next;
            list.curr = list.head;
        }

        /* Current list pointer points at tail */
        else if (list.curr == list.tail) {
            temp.prev.next = null;
            list.tail = temp.prev;
            list.curr = list.tail;
        }

        /* Current list pointer points at middle item */
        else {
            temp.prev.next = temp.next;
            temp.next.prev = temp.prev;
            list.curr = temp.next;
        }

        list.len--;
        freeNode(temp);
        return item;
    }
}

function ListConcat(list1, list2) {
    /* Do concatenation only when both of the lists are not NULL */
    if (list1 != null && list2 != null) {
        list1.tail.next = list2.head;
        list2.head.prev = list1.tail;
        freeList(list2);
    }
}

function ListFree(list,  itemFree) {

    /* 1. Free all nodes in the list */
    ListFirst(list);
    while(list.curr != null) {
        itemFree(list);
    }

    /* 2. Free the list */
    freeList(list);
}

function ListTrim(list) {
    ListLast(list);
    return ListRemove(list);
}


function ListPrint(list) {
    var iter = list.head;
    var output = "";
    while(iter != null) {
        output = output + " "+ iter.val;
        iter = iter.next;
    }
    console.log(output);
}