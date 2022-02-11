let store = {
  zoom: 13,
  center: [44.9531368, 34.0960693],
  markers: [],
  bmark: [
    // массив с обьектами для занесения в массив маркер инфы как обьекты
    {
      lat: null,
      lng: null,
      display_name: "",
    },
  ],
  priorities: ["По названию", "По координатам"],
  searchOf: "Введите название",
  popupInfo: [null, null],
  show: true,
  showSearch: true,
  latitude: null,
  longitude: null,
  moreInfo: true,
  name: "",
  i: null,
  message: "",
  postCity: "",
  beforeOtvet: "",
  afterOtvet: "",
  backgrLeft: "",
  backgrRight: "background: rgba(168, 150, 150, 0.6);",
  listData: [
    {
      id: null,
      display_name: "",
    },
  ],
  list: null,
  openState: true,
  postAPI(postCity, searchOf) {
    if (searchOf === "Введите координаты") {
      // Начало блока для запроса по координатам или клика по карте---------------------------------------------------
      if (/[a-zA-ZА-Яа-я]/.test(postCity) || !postCity.length) {
        alert(
          "Неверный формат данных \nВведите широту и долготу через запятую или пробел"
        );
      } else {
        let razdel = postCity.split(" ");
        if (razdel[0].indexOf(",") >= 0) {
          razdel[0] = razdel[0].slice(0, -1);
        }
        // For Nominatim------------------------------------

        postCity = `http://192.168.1.85/nominatim/reverse.php?lat=${razdel[0]}&lon=${razdel[1]}`;
        fetch(postCity)
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            if (data.length) {
              let start = data.indexOf("<result ");
              let finish = data.indexOf("</result>");
              let diff = data.slice(start + 8, finish);

              this.center = [razdel[0], razdel[1]];
              this.bmark.lat = razdel[0];
              this.bmark.lng = razdel[1];

              if (data.indexOf("</error") >= 0) {
                this.bmark.display_name =
                  "Информация о данной метке остутствует";
              }
              //----------------------------------------------------------------
              else {
                this.bmark.display_name = diff
                  .slice(diff.indexOf(">") + 1, diff.length)
                  .split("&quot;")
                  .join('"');
              }
              this.markers.push(Object.assign({}, this.bmark));
              // default info from marker---------------------
              this.name = this.bmark.display_name;
              this.latitude = this.bmark.lat;
              this.longitude = this.bmark.lng;
            } else {
              this.postCity.length == 0
                ? alert(`Введите название`)
                : alert(`Город ${this.postCity} не найден`);
            }
          });
      }
      // Конец блока для запроса по координатам или клика по карте---------------------------------------------------
    } else {
      // Начало блока для запроса по названию---------------------------------------------------
      if (/[a-zA-ZА-Яа-я]/.test(postCity)) {
        postCity = "http://192.168.1.85/nominatim/search.php?q=" + postCity;
        fetch(postCity)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.length) {
              this.listData = data;
              this.center = [data[0].lat, data[0].lon];
              this.markers.push(data[0]);
              // default info about marker
              this.name = data[0].display_name;
              this.latitude = data[0].lat;
              this.longitude = data[0].lon;
            } else {
              postCity.length == 0
                ? alert(`Введите название`)
                : alert(`Город ${this.postCity} не найден`);
            }
          });
      } else {
        alert("Неверно введено название");
      }
      // Конец блока для запроса по названию---------------------------------------------------
    }
  },
};

export default store;
