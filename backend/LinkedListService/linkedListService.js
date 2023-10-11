class listNode {
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}

class linkedList {
    constructor() {
        this.head = null;
        this._length = 0;
    }

    pushData = (data) => {
        let next = this.head
        
        this.head = new listNode(data, next);
        this._length++
    };

    addData = (data) => {
        let currentNode = this.head;

        if (currentNode) {
            while(currentNode.next) {
                currentNode = currentNode.next;
            };
            currentNode.next = new listNode(data);
         } else {
                this.head = new listNode(data);
            }
            this._length++
            return this.head
        };
    
    insertData = (data, index) => {
        console.log('Insertar datos', index)
        if (index !== 0 && index !== this._length && this._length > 1) {
            let currentNode = this.head;
            let count = 0;

            while (count !== index - 1) {
                count++;
                currentNode = currentNode.next;
            };

            let prevNode = currentNode;
            let nextNode = currentNode.next;
            let newNode = new listNode(data, nextNode);
            prevNode.next = newNode;
            this._length++;
            console.log(newNode)
            return newNode
        } else {
            return `Error: revise el indice!`
        }
    }    
}

const test1 = new linkedList();
const family = [{Nombre: 'Marina', Rol: 'Mama', Nacimiento: Date.UTC(1977,10,22)},
                {Nombre: 'Maxi', Rol: 'Papa', Nacimiento: Date.UTC(1977,6,22)},
                {Nombre: 'Dante', Rol: 'Hijo', Nacimiento: Date.UTC(2009,8,11)},
                {Nombre: 'Gaspar', Rol: 'Hijo', Nacimiento: Date.UTC(2012,6,4)}];

const familyNames = ['Norma', 'Norberto', 'Maxi', 'Alexis']


for (let person of familyNames) {
    test1.addData(person)
};

test1.insertData('Dante',3);
test1.insertData('Gaspar',4);
test1.insertData('Bonzo',5);

console.log(test1.head)