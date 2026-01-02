let mode = "single";
function show(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
    document.getElementById(id).classList.add("hidden");
}

function selectSingle() {
    mode = "single";

    show("sizeSection");
    hide("matrixBSection");

    document.getElementById("matrixATitle").innerText = "Matrix";

    hide("operationSection");
    hide("resultSection");
}

function selectDouble() {
    mode = "double";

    show("sizeSection");
    show("matrixBSection");

    document.getElementById("matrixATitle").innerText = "Matrix A";
    document.getElementById("matrixBTitle").innerText = "Matrix B";

    hide("operationSection");
    hide("resultSection");
}

function generateMatrix() {
    let r1 = Number(rows1.value);
    let c1 = Number(cols1.value);
    let r2 = Number(rows2.value);
    let c2 = Number(cols2.value);

    matrix.innerHTML = "";
    matrix2.innerHTML = "";

    matrix.style.gridTemplateColumns = "repeat(" + c1 + ", auto)";
    matrix2.style.gridTemplateColumns = "repeat(" + c2 + ", auto)";

    // Matrix A
    for (let i = 0; i < r1; i++) {
        for (let j = 0; j < c1; j++) {
            matrix.appendChild(makeInput("A-" + i + "-" + j));
        }
    }

    // Matrix B (only in double mode)
    if (mode === "double") {
        for (let i = 0; i < r2; i++) {
            for (let j = 0; j < c2; j++) {
                matrix2.appendChild(makeInput("B-" + i + "-" + j));
            }
        }
    }

    show("operationSection");

    if (mode === "single") {
        show("singleOps");
        hide("doubleOps");
    } else {
        show("doubleOps");
        hide("singleOps");
    }
}

function makeInput(id) {
    let input = document.createElement("input");
    input.type = "number";
    input.id = id;
    return input;
}

function read(prefix) {
    let r, c;

    if (prefix === "A") {
        r = Number(rows1.value);
        c = Number(cols1.value);
    } else {
        r = Number(rows2.value);
        c = Number(cols2.value);
    }

    let mat = [];

    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            let val = Number(
                document.getElementById(prefix + "-" + i + "-" + j).value
            );
            row.push(val);
        }
        mat.push(row);
    }

    return mat;
}

function display(mat, title) {
    resultTitle.innerText = title;

    if (typeof mat === "number") {
        result.innerText = mat;
    } else {
        let out = "";
        for (let i = 0; i < mat.length; i++) {
            out += mat[i].join(" ") + "\n";
        }
        result.innerText = out;
    }

    show("resultSection");
}
/* --Operators--*/

function add() {
    let a = read("A");
    let b = read("B");
    display(addition(a, b), "A + B");
}

function subtract() {
    let a = read("A");
    let b = read("B");
    display(subtraction(a, b), "A - B");
}

function mul() {
    let a = read("A");
    let b = read("B");
    display(multiplication(a, b), "A × B");
}

function det() {
    display(det2(read("A")), "Determinant");
}

function trace() {
    display(traceMat(read("A")), "Trace");
}

function sq() {
    let a = read("A");
    display(multiplication(a, a), "Square");
}

function cube() {
    let a = read("A");
    let a2 = multiplication(a, a);
    display(multiplication(a2, a), "Cube");
}

function adj() {
    display(adj2(read("A")), "Adjoint");
}

function inv() {
    let a = read("A");
    let d = det2(a);
    display(scdiv(adj2(a), d), "Inverse");
}

function rank() {
    let a = read("A");
    display(findrank(a, a.length, a[0].length), "Rank");
}

/*--Glue Functions--*/

function addition(a, b) {
    let r = a.length;
    let c = a[0].length;
    let res = [];

    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            row.push(a[i][j] + b[i][j]);
        }
        res.push(row);
    }
    return res;
}

function subtraction(a, b) {
    let r = a.length;
    let c = a[0].length;
    let res = [];

    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            row.push(a[i][j] - b[i][j]);
        }
        res.push(row);
    }
    return res;
}

function multiplication(a, b) {
    let r1 = a.length;
    let c1 = a[0].length;
    let c2 = b[0].length;

    let res = [];

    for (let i = 0; i < r1; i++) {
        let row = [];
        for (let j = 0; j < c2; j++) {
            let sum = 0;
            for (let k = 0; k < c1; k++) {
                sum += a[i][k] * b[k][j];
            }
            row.push(sum);
        }
        res.push(row);
    }
    return res;
}

function det2(a) {
    return a[0][0] * a[1][1] - a[0][1] * a[1][0];
}

function traceMat(a) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += a[i][i];
    }
    return sum;
}

function adj2(a) {
    return [
        [ a[1][1], -a[0][1] ],
        [ -a[1][0], a[0][0] ]
    ];
}

function scdiv(a, k) {
    let r = a.length;
    let c = a[0].length;
    let res = [];

    for (let i = 0; i < r; i++) {
        let row = [];
        for (let j = 0; j < c; j++) {
            row.push(a[i][j] / k);
        }
        res.push(row);
    }
    return res;
}

function findrank(m, r, c) {
    let rank = c;

    for (let i = 0; i < rank; i++) {
        if (m[i][i] !== 0) {
            for (let j = 0; j < r; j++) {
                if (j !== i) {
                    let mult = m[j][i] / m[i][i];
                    for (let k = 0; k < rank; k++) {
                        m[j][k] -= mult * m[i][k];
                    }
                }
            }
        } else {
            let reduce = true;

            for (let j = i + 1; j < r; j++) {
                if (m[j][i] !== 0) {
                    let temp = m[i];
                    m[i] = m[j];
                    m[j] = temp;
                    reduce = false;
                    break;
                }
            }

            if (reduce) {
                rank--;
                for (let j = 0; j < r; j++) {
                    m[j][i] = m[j][rank];
                }
                i--;
            }
        }
    }
    return rank;
}
