let ally = {};

(function (ally) {
    function OKR(dom, url) {
        let okrurl = url;
        let okrList = null;
        let okrPCMap = new Map();
        let okrMap = new Map();
        let filterList = new Set();
        let filter = [];
        let rootElement = dom;
        this.init = function () {
            initialize();
        };
        async function initialize() {
            let rootTemplate = createContainer();
            rootElement.appendChild(rootTemplate);
            okrList = await fetch(okrurl, {
                method: "GET"
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    return data["data"];
                });
            computePatentChildAndFilter(okrList);
            let okrFilterContaner = createFilterContainer(filterList);
            let okrFilterContanerDom = document.querySelector('#search');
            okrFilterContanerDom.appendChild(okrFilterContaner);
            let okrListContainerList = createOkrListContainer(okrPCMap, filter);
            let okrListContainer = document.querySelector('#okrlist');
            okrListContainer.appendChild(okrListContainerList);
            attachEvents();
        }

        function computePatentChildAndFilter(okrList) {
            for (let okr of okrList) {
                filterList.add(okr.category);
                okrMap.set(okr.id, okr);
                if (okr.parent_objective_id != "" && okrPCMap.has(okr.parent_objective_id)) {
                    let list = okrPCMap.get(okr.parent_objective_id);
                    list.push(okr.id);
                }
                else if (okr.parent_objective_id != "" && !okrPCMap.has(okr.parent_objective_id)) {
                    okrPCMap.set(okr.parent_objective_id, [okr.id])
                }
            }
        }

        function createContainer() {
            let template =
                `<div id="ally"> 
                <div id="search"></div>
                <div id="okrlist"></div>
                </div>`;
            return toHTML(template);
        }

        function createFilterContainer(filterList) {
            let template = "";
            for (let val of filterList) {
                console.log(val);
                template += `<li><input type="checkbox" value="${val}"><span>${val}</span></li>`
            }
            return toHTML(`<ul>${template}</ul>`);
        }

        function createOkrListContainer(okrPCMap, filter) {
            let filterMap = null;
            if (filter.length == 0) {
                filterMap = okrPCMap;
            }
            else {
                filterMap = filterOkr(okrPCMap, filter);
            }
            let template = '';
            for (let [key, value] of filterMap) {
                let childContainer = createOkrChildContainer(value)
                let o = okrMap.get(key);
                if (o == null) {
                    continue;
                }
                template +=
                    `<div id=${key} class="okrParent">
                    <div class="ptitle">
                    <button type="button" class="toggleBtn">Hide</button> ${o.title}----(${o.category})
                    </div>
                    <div class="okrchild">${childContainer}</div>
                </div>`
            }
            return toHTML(`<div class="holder2">${template}</div>`);
        }

        function filterOkr(okrPCMap, filter) {
            let filterMap = new Map();
            for (let [key, value] of okrPCMap) {
                let okr = okrMap.get(key);
                if (okr) {
                    if (filter.includes(okr.category)) {
                        filterMap.set(key, value);
                    }
                }
            }
            return filterMap;
        }

        function createOkrChildContainer(child) {
            let template = "";
            for (let c of child) {
                let ch = okrMap.get(c);
                if (ch == null) {
                    continue;
                }
                template +=
                    `<div class="ctitle">|-------------------------${ch.title}</div>`
            }
            return `<div>${template}</div>`;
        }

        function attachEvents() {
            let toggleEvent = document.querySelector('#okrlist');
            toggleEvent.addEventListener('click', toggleChild);
            let searchEvent = document.querySelector('#search');
            searchEvent.addEventListener('change', doFilter);
        }

        function doFilter(event) {
            if (event.target.checked) {
                filter.push(event.target.value);
            } else {
                let index = filter.indexOf(event.target.value);
                if (index !== -1) {
                    filter.splice(index, 1);
                }
            }
            let okrListContainerList = createOkrListContainer(okrPCMap, filter);
            let okrListContainer = document.querySelector('#okrlist');
            okrListContainer.innerHTML = "";
            okrListContainer.appendChild(okrListContainerList);
        }

        function toggleChild(event) {
            if (event.target.type == 'button') {
                let parentNode = event.target.parentElement.parentElement;
                let objNode = parentNode.querySelector('.okrchild');
                let btnNode = parentNode.querySelector('.toggleBtn');
                if (objNode.classList.contains('toggle')) {
                    objNode.classList.remove('toggle');
                    btnNode.innerHTML = 'Hide';
                }
                else {
                    objNode.classList.add('toggle');
                    btnNode.innerHTML = 'Show';
                }
            }
        }

        function toHTML(template) {
            let templateHolder = document.createElement("div");
            templateHolder.innerHTML = template;
            return templateHolder.firstChild;
        }
    }
    ally.OKR = OKR;
})(ally);

export default ally;
