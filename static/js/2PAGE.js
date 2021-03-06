let currentNum = 0;
let theme = '';

$(document).ready(function () {
    let currentTheme = ''
    let getLink = window.location.href

    theme = getLink.split('/')[4]
    let h2 = document.createElement('h2')

    if (theme === 'camping') {
        currentTheme = '글램핑, 캠핑'
    } else if (theme === 'festival') {
        currentTheme = '페스티벌'
    } else if (theme === 'trip') {
        currentTheme = '여행'
    } else if (theme === 'hiking') {
        currentTheme = '등산, 외박'
    } else if (theme === 'water') {
        currentTheme = '물놀이'
    }

    h2.innerText = currentTheme
    h2.classList.add("theme_title")

    let appendDom = document.querySelector('.logo-div')
    appendDom.appendChild(h2)

    listing();
});

function listing() {
    $.ajax({
        type: "POST",
        url: `/theme/${theme}`,
        data: {},
        success: function (response) {
            let rows = response["travels"];
            console.log(rows);
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]["comment"];
                let title = rows[i]["title"];
                let desc = rows[i]["desc"];
                let image = rows[i]["image"];
                let num = rows[i]["num"];

                let temp_html = `
        <div class="card">
          <img src="${image}" class="card-img">
          <p class="card-text">${comment}</p>
          <div class="card-img-overlay">
              <div class="card-info">
                <h5 class="card-title" onclick="modal_input_box(${num})" data-bs-toggle="modal" data-bs-target="#mymodal">${title}</h5>
                <p class="card-text" onclick="modal_input_box(${num})" data-bs-toggle="modal" data-bs-target="#mymodal">${desc}</p>
                <p class="card-text" onclick="modal_input_box(${num})" data-bs-toggle="modal" data-bs-target="#mymodal">${desc}</p>
                      </div>
                      <div class="trashcan-div">
                        <img class="card-trashcan" onclick="delete_list(${num})" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABERET8/PwMDAyrq6vFxcXm5ubc3NyRkZGmpqYqKipUVFS4uLhubm7V1dW+vr5hYWHx8fGampo3NzeKioouLi5JSUmxsbH39/d8fHwhISFOTk6Dg4MlJSV6enoVFRU9PT00NDRjY2NycnLY2NjDvgQeAAAEM0lEQVR4nO3d63KiQBAFYC4qahQQRMWImpi8/ysuiZuqXVuwBw/OmDrnVyqFVH8FzkwjqOf3k8Hr6j3YzRZxfDhURVFM8r+ZDuuc/5zU/98ePuLFbBe8rV57qsTrY6frSZKVnmHKaBP3oexBWI1DU91Pss0SXg5cWGRdeeeM9uCCwMIguc9XpyywJWGF287n579JBsiaoMIC4aszRo44SOEEBPS8CEgECk8wYD3e4MrCCd/vHET/zxRWF044QgI9L0DVBRMusEAvQRUGE36Chd4JVBhKOEMDYYMNSjiHC0PQOxEk3Bu3ErcDGk5BwhgP9MaY0kBC/ElaZwUpDSSMrhQ42s6Ct+VyuRd5WZ4TBMF6tlicPqr8Wk+yhZSGEb7LniJam+0il8IhpDaM8MqSdGG6D3kUMZM+RljJQ2hlH9eCEU5FdXPjfezFPkpIJ4wRbkR1eYdSRCBdIkYoJ4vKfCey+4JclOrrGBqOpF+RQ80RUdtN4Wq3iL+uWueTfPqV4Xc235l/J01TOR2O5qbZyGOYKl52uFO4G/Ww4MQmumFsFxaQq4N9p33ebBXKKcrNtF6aaxMunT9Df9I2+7YJU9uF69PSLbcI++hq+0pLt9wiPNgu2yAt3XKLUE7j7iZs7palsIrG5zzRSVoPp+eaIzlzSCHu8xUbKX+9MKOQQudDIYXuh0IK3Q+FFLofCs/C8HmjEu6Dp45C+NtC4fOHwucPhc8fjXDgbkDCse2lWHNiCimk0HoopJBC+6GQQgrth0IKKbQfCimk0H4opJBC+3mYsEwuIl4SXm6RiGelsptbWBSK7z84Xm4hnwcVX9cjnihYuyx8uS0U93wIoeKbKCikkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBCCimkkEIKKaSQQgoppJBC94SnXy9U/K4yhRRSSCGFFFJI4TnyR88ppJBCCimkkEIKHyicUUjhOSMKKaSQQgopvJnUWWG4ppDCzsLjbSHiu6AfJ8zSi4jBqbzcIhVXYaPLLW6vhx8ntJVQ/kh1J+HcNqQx4RuFFFJoO+ESI9zYhjSmXFGoEw5tQxpT7jHCqW1IY8pXjDC3DWlMecQIRRfgTDJF9RphZRvSGNmxdBOebEMak4CEx9K2pCk5SKi4FGUpivZQJ/ywLWmI5m2oE/qOnqYFTujmnK+ZDbXCVWZbcy2acUYrdHJZkymWbHrhwMGDONGVrhT6sW2PiGa2NxE610KFisbJTKi4X+GhUTzxZCrcK35S8nFRTYWGQn/lEFE5yhgK/cGnbdhPtgZVmwj9gRufYGSKZ/I6Cus1uAMr1FQ303cU+kfbs0akuB3xLqHvLzcW1zeJyTuwq7CeN6qRFeR4qrj1AiKsc9wdinw6fFjySRUrrm9fyx8ijK5RarUBFAAAAABJRU5ErkJggg==">
                      </div> 
              </div>
          </div>
        </div>`;
                $("#cards-box").append(temp_html);
            }
        },
    });
}

function posting() {
    let url = $("#url").val();
    let comment = $("#comment").val();
    $.ajax({
        type: "POST",
        url: "/travel",
        data: {url_give: url, comment_give: comment, theme_give: theme},
        success: function (response) {
            alert(response["msg"]);
            window.location.reload();
        },
    });
}

function delete_list(num) {
    currentNum = num;
    $.ajax({
        type: "POST",
        url: "/travel/delete",
        data: {num_give: num},
        success: function (response) {
            window.location.reload();
            console.log(response["numdone"]);

        },
    });
}

function open_box() {
    $("#post-box").show();
}

function close_box() {
    $("#post-box").hide();
}

//
function show_supplies(num) {
    currentNum = num;
    $.ajax({
        type: "POST",
        url: "/travel/supplies",
        data: {num_give: num},
        success: function (response) {
            let rows = response["supplieslist"];
            $("#supplies-list").html("");
            let modal_title = response["modal-title"];
            console.log(modal_title)
            document.querySelector(".modal-title").innerText = modal_title + "에 가져가야할것들!";

            for (let i = 0; i < rows.length; i++) {
                let supplies = rows[i]["supplies"];
                let index = rows[i]["index"];
                let done = rows[i]["done"];
                console.log("index is ", index, supplies);
                let temp_html = ``;

                if (done == 0) {
                    temp_html = `
<li>
<h2 class="supplies-text">✅ ${supplies}</h2>
<button onclick="done_supplies(${currentNum}, ${index}, event)" type="button" class="btn btn-outline-primary">완료!</button>
<button onclick="delete_supplies(${currentNum}, ${index}, event)" type="button" class="btn">삭제</button>
</li>
`;
                } else {
                    temp_html = `
<li>
<h2 class="done">✔ ${supplies}</h2>
<button onclick="done_supplies(${currentNum}, ${index}, event)" type="button" class="btn btn-outline-success">해제!</button>
<button onclick="delete_supplies(${currentNum}, ${index}, event)" type="button" class="btn">삭제</button>
</li>
`;
                }
                $("#supplies-list").append(temp_html);
            }
        },
    });
}

function delete_supplies(currentNum, index, event) {
    let li = event.target.parentElement;

    $.ajax({
        type: "POST",
        url: "/supplies/delete",
        data: {currentNum_give: currentNum, index_give: index},
        success: function (response) {
            // alert(response['msg'])
            // window.location.reload();
            li.remove();
            modal_input_box(currentNum);
        },
    });
}

// function delete_all_supplies(currentNum) {


//   $.ajax({
//     type: "POST",
//     url: "/supplies/all_delete",
//     data: { currentNum_give: currentNum },
//     success: function (response) {
//       // alert(response['msg'])
//       // window.location.reload();
//     },
//   });
// } 

function save_supplies() {
    const input_tag = document.querySelector("#supplies-1");
    let supplies = $("#supplies-1").val();

    if (supplies !== "") {
        $.ajax({
            type: "POST",
            url: "/supplies",
            data: {supplies_give: supplies, num_give: currentNum},
            success: function (response) {
                let num = response["num"];
                let index = response["index"];
                console.log(num, index);

                // alert('준비물 등록 완료!')
                let li = document.createElement("li");
                let h2 = document.createElement("h2");
                let button = document.createElement("button");
                let button_1 = document.createElement("button");

                h2.classList.add("supplies-text");
                h2.innerText = `✅ ${supplies}`;

                button.innerText = "완료!";
                button.type = "button";
                button.classList.add("btn", "btn-outline-primary");
                button.setAttribute(
                    "onclick",
                    `done_supplies(${num}, ${index}, event)`
                );

                button_1.innerText = "삭제";
                button_1.type = "button";
                button_1.classList.add("btn");
                button_1.setAttribute(
                    "onclick",
                    `delete_supplies(${num}, ${index}, event)`
                );

                li.classList.add("list");
                li.appendChild(h2);
                li.appendChild(button);
                li.appendChild(button_1);

                document.querySelector("#supplies-list").appendChild(li);
                input_tag.value = null;
            },
        });
    } else {
        alert("입력하십시오!");
    }
}

function done_supplies(currentNum, index, e) {
    let li = e.target.parentElement;
    let h2 = li.children[0];
    let button = li.children[1];
    console.log(li);
    $.ajax({
        type: "POST",
        url: "/supplies/done",
        data: {currentNum_give: currentNum, index_give: index},
        success: function (response) {
            // alert(response["msg"])
            // window.location.reload()

            let done = response["supplieslist"][index - 1];
            console.log(done["done"]);
            if (done["done"] == 0) {
                h2.classList.add('done')
                h2.style = 'color:grey'
                h2.innerText = `✔ ${done['supplies']}`
                button.innerText = '해제!'
                button.classList.add('btn-outline-success')
            } else {
                h2.classList.remove('done')
                h2.style = 'color:black'
                h2.innerText = `✅ ${done['supplies']}`
                button.innerText = '완료!'
                button.classList.remove('btn-outline-success')
                button.classList.add('btn-outline-primary')
            }
        },
    });
}

function modal_input_box(num) {
    $("#suppliesInput").show();
    //num을 이용하여 show supplies 실행....
    console.log("ahahahahahah");
    show_supplies(num);
}

