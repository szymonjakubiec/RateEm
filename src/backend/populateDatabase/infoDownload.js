const mysql = require("mysql2");
const fs = require("fs");

var config = {
  host: "rateem-server.mysql.database.azure.com",
  user: "GodAdmin",
  password: "ZAQ!2wsx",
  database: "ratem",
  port: 3306,
  ssl: { ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem") },
};

class InfoDownload {
  sejmKadencje = Array();
  prezydentKadencje = Array();
  euKadencje = Array();
  politycy = Array();
  partie = Array();

  async main() {
    await this.getData();
    this.uploadData();
  }

  async getData() {
    await this.sejmKadencja();
    await this.prezydentKadencja();
    await this.euKadencja();
    await this.sejmPolitycy();
    await this.euPolitycy();
    this.sortPolitycy();

    await this.sejmDistricts();
  }

  async sejmKadencja() {
    try {
      // pobiera z API daty poprzednich wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=o%20wynikach%20wyborów%20do%20sejmu%20rzeczypospolitej%20polskiej%20&type=Obwieszczenie`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.sejmWszystkieKadencje = await response.json();

      this.sejmWszystkieKadencje.items.forEach((sejmKadencja_info) => {
        var date = sejmKadencja_info.title.split("przeprowadzonych w dniu ")[1];
        date = date.split(" r.")[0];
        date = this.makeDateAppropriate(date);
        date = date[2] + "-" + date[1] + "-" + date[0];

        this.sejmKadencje.push(date);
      });
    } catch (error) {
      console.log(error.message);
    }

    try {
      // szacuje date przyszłych wyborów
      const url = `https://api.sejm.gov.pl/sejm/term`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.sejmWszystkieKadencje = await response.json();

      var currentTerm = this.sejmWszystkieKadencje[this.sejmWszystkieKadencje.length - 1];

      var date = new Date(currentTerm.from); // początek kadencji
      var year = date.getFullYear(); // rok rozpoczęcia kadencji
      var day = date.getDate(); // dzień rozpoczęcia kadencji
      date.setFullYear(year + 4); // rok zakończenia kadencji
      date.setDate(day - 30); // początek przedziału w którym mogą odbyć się wybory
      date = date.toISOString().substring(0, 10);

      this.sejmKadencje.unshift(date);
    } catch (error) {
      console.log(error.message);
    }
  }

  async prezydentKadencja() {
    try {
      // pobiera z API daty poprzednich wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=wyniku%20wyborów%20prezydenta%20rzeczypospolitej%20polskiej%20&type=Obwieszczenie`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.prezydentPoprzednieKadencje = await response.json();

      this.prezydentPoprzednieKadencje.items.forEach((prezydentKadencja_info) => {
        if (prezydentKadencja_info.title.includes("zarządzonych na dzień")) {
          var date = prezydentKadencja_info.title.split("zarządzonych na dzień ")[1];
          date = date.split(" r.")[0];
          date = this.makeDateAppropriate(date);
          date = date[2] + "-" + date[1] + "-" + date[0];

          if (!this.prezydentKadencje.includes(date)) {
            this.prezydentKadencje.push(date);
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }

    try {
      // szacuje date przyszłych wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=MP&title=złożenia%20przysięgi%20przez%20nowo%20wybranego%20Prezydenta%20Rzeczypospolitej%20Polskiej&type=Protokół`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.prezydentPrzyszłaKadencja = await response.json();

      var currentTerm = this.prezydentPrzyszłaKadencja.items[0];

      var date = new Date(currentTerm.announcementDate); // początek kadencji
      var year = date.getFullYear(); // rok rozpoczęcia kadencji
      var day = date.getDate(); // dzień rozpoczęcia kadencji
      date.setFullYear(year + 5); // rok zakończenia kadencji

      var date_start = new Date(date);
      // var date_stop = new Date(date)

      date_start.setDate(day - 100); // początek przedziału w którym mogą odbyć się wybory
      // date_stop.setDate(day-75)  // początek przedziału w którym mogą odbyć się wybory

      date_start = date_start.toISOString().substring(0, 10);
      // date_stop = (date_stop.toISOString()).substring(0,10)

      // date = date_start + ' ' + date_stop
      date = date_start;

      // console.log(date_start, date_stop)

      this.prezydentKadencje.unshift(date);
    } catch (error) {
      console.log(error.message);
    }

    // console.log("Prezydent, kadencje:")
    // console.log(this.prezydentKadencje)
  }

  async euKadencja() {
    const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=o%20wynikach%20wyborów%20posłów%20do%20Parlamentu%20Europejskiego%20przeprowadzonych%20w%20dniu&type=Obwieszczenie`;

    try {
      // pobiera z API
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.euWszystkieKadencje = await response.json();

      this.euWszystkieKadencje.items.forEach((euKadencja_info) => {
        var date = euKadencja_info.title.split("przeprowadzonych w dniu ")[1];
        date = date.split(" r.")[0];
        date = this.makeDateAppropriate(date);
        date = date[2] + "-" + date[1] + "-" + date[0];

        this.euKadencje.push(date);
      });

      // szacuje date przyszłych wyborów
      var date = new Date(this.euKadencje[0]);
      date.setFullYear(date.getFullYear() + 5);
      date = date.toISOString().split("T")[0];

      this.euKadencje.unshift(date);
    } catch (error) {
      console.log(error.message);
    }
  }

  makeDateAppropriate(date) {
    date = date.replace("stycznia", "01");
    date = date.replace("lutego", "02");
    date = date.replace("marca", "03");
    date = date.replace("kwietnia", "04");
    date = date.replace("maja", "05");
    date = date.replace("czerwca", "06");
    date = date.replace("lipca", "07");
    date = date.replace("sierpnia", "08");
    date = date.replace("września", "09");
    date = date.replace("października", "10");
    date = date.replace("listopada", "11");
    date = date.replace("grudnia", "12");

    var date = date.split(" ");

    if (date[0].length == 1) {
      date[0] = date[0].replace("1", "01");
      date[0] = date[0].replace("2", "02");
      date[0] = date[0].replace("3", "03");
      date[0] = date[0].replace("4", "04");
      date[0] = date[0].replace("5", "05");
      date[0] = date[0].replace("6", "06");
      date[0] = date[0].replace("7", "07");
      date[0] = date[0].replace("8", "08");
      date[0] = date[0].replace("9", "09");
    }

    return date;
  }

  async sejmPolitycy() {
    try {
      // pobiera numery kadencji sejmu (żeby wiedzieć, na jakim numerze zakończyć)
      const url = `https://api.sejm.gov.pl/sejm/term`;
      const response = await fetch(url);
      if (!response.ok) {
        console.log(response.ok);
        return;
      }
      this.sejmWszystkieKadencje = await response.json();
      this.sejmWszystkieKadencje.reverse();

      // pobiera wszystkich posłów dla każdej kadencji
      for (const kadencja of this.sejmWszystkieKadencje) {
        // zaczynaja od 8 kadencji, żeby nie było za dużo nieaktualnych osób
        if (kadencja.num >= 8) {
          const url = `https://api.sejm.gov.pl/sejm/term${kadencja.num}/MP`;
          const response = await fetch(url);
          if (!response.ok) {
            console.log(response.ok);
            return;
          }
          var sejmKadencjaPolitycy = await response.json();

          await this.getClubsFullNames();

          for (const osoba of sejmKadencjaPolitycy) {
            // przed dodaniem do listy waliduje czy taka osoba już w niej nie jest
            if (!this.politycy.some((e) => e.fullName.toLowerCase() == osoba.firstLastName.toLowerCase())) {
              var osobaTemp = {};
              osobaTemp.fullName = osoba.firstLastName;
              osobaTemp.firstName = osoba.secondName ? osoba.firstName + " " + osoba.secondName : osoba.firstName;
              osobaTemp.lastName = osoba.lastName;
              osobaTemp.partiaSkrot = osoba.club;
              osobaTemp.partia = this.getClubFullName(osobaTemp.partiaSkrot);
              osobaTemp.dataUrodzenia = osoba.birthDate;
              osobaTemp.zdjecie = `https://api.sejm.gov.pl/sejm/term${kadencja.num}/MP/${osoba.id}/photo`
                ? `https://api.sejm.gov.pl/sejm/term${kadencja.num}/MP/${osoba.id}/photo`
                : null;
              osobaTemp.linkFacebook = null;
              osobaTemp.linkTweeter = null;

              this.politycy.push(osobaTemp);
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async euPolitycy() {
    try {
      // pobiera numery kadencji eu parlamentu (żeby wiedzieć, na jakim numerze zakończyć)
      this.euWszystkieKadencje = [{ num: 10 }, { num: 9 }, { num: 8 }]; // rozwiązanie tymczasowe
      //
      //
      //

      // pobiera wszystkich posłów dla każdej kadencji
      for (const kadencja of this.euWszystkieKadencje) {
        // zaczynaja od 8 kadencji, żeby nie było za dużo nieaktualnych osób
        if (kadencja.num >= 8) {
          const url = `https://data.europarl.europa.eu/api/v2/meps?parliamentary-term=${kadencja.num}&country-of-representation=PL&format=application%2Fld%2Bjson&offset=0`;
          const response = await fetch(url);
          if (!response.ok) {
            console.log(response.ok);
            return;
          }
          var euKadencjaPolitycy = await response.json();

          for (const osoba of euKadencjaPolitycy.data) {
            // przed dodaniem do listy waliduje czy taka osoba już w niej nie jest
            if (!this.politycy.some((e) => e.fullName.toLowerCase() == osoba.givenName.toLowerCase() + " " + osoba.familyName.toLowerCase())) {
              // pobiera szczegółowe info o eu parlamentarzystach
              const url = `https://data.europarl.europa.eu/api/v2/meps/${osoba.identifier}?format=application%2Fld%2Bjson`;
              const response = await fetch(url);
              if (!response.ok) {
                console.log(response.ok);
                return;
              }
              var politykSzczegoly = await response.json();

              var osobaTemp = {};
              osobaTemp.fullName = osoba.givenName + " " + osoba.familyName;
              osobaTemp.firstName = osoba.givenName;
              osobaTemp.lastName = osoba.familyName;
              osobaTemp.partiaSkrot = null;
              osobaTemp.partia = null;
              osobaTemp.dataUrodzenia = politykSzczegoly.data[0].bday;
              osobaTemp.zdjecie = politykSzczegoly.data[0].img;

              if (politykSzczegoly.data[0].account !== undefined) {
                for (const link in politykSzczegoly.data[0].account) {
                  if (politykSzczegoly.data[0].account[link].id.includes("facebook")) {
                    osobaTemp.linkFacebook = politykSzczegoly.data[0].account[link].id;
                  } else {
                    osobaTemp.linkFacebook = null;
                  }
                  if (politykSzczegoly.data[0].account[link].id.includes("twitter")) {
                    osobaTemp.linkTweeter = politykSzczegoly.data[0].account[link].id;
                  } else {
                    osobaTemp.linkTweeter = null;
                  }
                }
              } else {
                osobaTemp.linkFacebook = null;
                osobaTemp.linkTweeter = null;
              }

              this.politycy.push(osobaTemp);
            }
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // pobiera pełne nazwy klubów parlamentarnych
  async getClubsFullNames() {
    for (const kadencja of this.sejmWszystkieKadencje) {
      // zaczynaja od 8 kadencji, żeby nie było za dużo nieaktualnych osób
      if (kadencja.num >= 8) {
        const url = `https://api.sejm.gov.pl/sejm/term${kadencja.num}/clubs`;
        const response = await fetch(url);
        if (!response.ok) {
          console.log(response.ok);
          return;
        }
        var partieKadencja = await response.json();

        for (const partie of partieKadencja) {
          if (!this.partie.some((e) => e.name == partie.id)) {
            var partieTemp = {};
            partieTemp.name = partie.id;
            partieTemp.fullName = partie.name;

            // console.log(partieTemp)
            this.partie.push(partieTemp);
          }
        }
      }
    }
  }

  // zwraca pełną nazwę partii dla podanego skrótu nazwy partii
  getClubFullName(partiaSkrot) {
    for (const partia of this.partie) {
      if (partia.name == partiaSkrot) {
        return partia.fullName;
      }
    }
    return;
  }

  sortPolitycy() {
    this.politycy.sort(function (a, b) {
      var textA = a.fullName.toLowerCase();
      var textB = b.fullName.toLowerCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  uploadData() {
    var self = this;
    this.conn = new mysql.createConnection(config);

    this.conn.connect(function (err) {
      if (err) {
        console.log("Cannot connect. Error: ");
        throw err;
      } else {
        self.uploadKadencjaSejm();
        self.uploadKadencjaPrezydent();
        self.uploadKadencjaEu();

        self.conn.end(function (err) {
          if (err) throw err;
        });
      }
    });

    self.uploadPolitycy();
  }

  uploadKadencjaSejm() {
    for (const wybor of this.sejmKadencje) {
      var name = "sejm_" + wybor;
      var przyszle = new Date(wybor) > new Date() ? true : false;

      this.conn.query("REPLACE INTO wybory_sejm SET nazwa=?, data=?, przyszle=?;", [name, wybor, przyszle], function (err, results, fields) {
        if (err) throw err;
      });
    }
  }

  uploadKadencjaPrezydent() {
    for (const wybor of this.prezydentKadencje) {
      var name = "prezydent_" + wybor;
      var przyszle = new Date(wybor) > new Date() ? true : false;

      this.conn.query("REPLACE INTO wybory_prezydent SET nazwa=?, data=?, przyszle=?;", [name, wybor, przyszle], function (err, results, fields) {
        if (err) throw err;
      });
    }
  }

  uploadKadencjaEu() {
    for (const wybor of this.euKadencje) {
      var name = "eu_" + wybor;
      var przyszle = new Date(wybor) > new Date() ? true : false;

      this.conn.query("REPLACE INTO wybory_eu SET nazwa=?, data=?, przyszle=?;", [name, wybor, przyszle], function (err, results, fields) {
        if (err) throw err;
      });
    }
  }

  async uploadPolitycy() {
    for (const polityk of this.politycy) {
      const resultLength = await this.getPolitician(polityk);

      if (resultLength === 0) {
        try {
          await this.insertNewPolitician(polityk);
        } catch (err) {
          console.error(`Failed to insert ${polityk.fullName}:`, err);
        }
      } else {
        try {
          await this.updatePolitician(polityk);
        } catch (err) {
          console.error(`Failed to insert ${polityk.fullName}:`, err);
        }
      }
    }
  }

  async getPolitician(polityk) {
    var conn = new mysql.createConnection(config);
    let resultLength = 0;

    try {
      await conn.connect();
      return new Promise((resolve, reject) => {
        conn.execute(
          "SELECT id, imie__drugie_imie__nazwisko FROM politycy WHERE imie__drugie_imie__nazwisko=?;",
          [polityk.fullName],
          (err, results) => {
            if (err) {
              console.error("Error in getPolitician:", err);
              reject(err);
            } else {
              resultLength = results.length;
              resolve(resultLength);
            }
          }
        );
      });
    } catch (err) {
      console.error("Error in getPolitician:", err);
      throw err;
    } finally {
      await conn.end();
    }
  }

  async insertNewPolitician(polityk) {
    var conn = new mysql.createConnection(config);

    try {
      await conn.connect();
      return new Promise((resolve, reject) => {
        conn.execute(
          "INSERT INTO politycy SET imie__drugie_imie__nazwisko=?, imie=?, nazwisko=?, partia_skrot=?, partia=?, data_urodzenia=?, zdjecie=?, link_facebook=?, link_tweeter=?;",
          [
            polityk.fullName,
            polityk.firstName,
            polityk.lastName,
            polityk.partiaSkrot,
            polityk.partia,
            polityk.dataUrodzenia,
            polityk.zdjecie,
            polityk.linkFacebook,
            polityk.linkTweeter,
          ],
          (err, results) => {
            if (err) {
              console.error("Error inserting politician:", err);
              reject(err);
            } else {
              console.log(`Inserted new politician: ${polityk.fullName}`);
              resolve(results);
            }
          }
        );
      });
    } catch (err) {
      console.error("Error in insertNewPolitician:", err);
      throw err;
    } finally {
      await conn.end();
    }
  }

  async updatePolitician(polityk) {
    var conn = new mysql.createConnection(config);

    try {
      await conn.connect();
      return new Promise((resolve, reject) => {
        conn.execute(
          "UPDATE politycy SET imie=?, nazwisko=?, partia_skrot=?, partia=?, data_urodzenia=?, zdjecie=?, link_facebook=?, link_tweeter=? WHERE imie__drugie_imie__nazwisko=?;",
          [
            polityk.firstName,
            polityk.lastName,
            polityk.partiaSkrot,
            polityk.partia,
            polityk.dataUrodzenia,
            polityk.zdjecie,
            polityk.linkFacebook,
            polityk.linkTweeter,
            polityk.fullName,
          ],
          (err, results) => {
            if (err) {
              console.error("Error updating politician:", err);
              reject(err);
            } else {
              console.log(`Updated politician: ${polityk.fullName}`);
              resolve(results);
            }
          }
        );
      });
    } catch (err) {
      console.error("Error in updatePolitician:", err);
      throw err;
    } finally {
      await conn.end();
    }
  }
}

const infoDownload = new InfoDownload();
infoDownload.main();

// pobierać przynależność partyjną EU

// weryfikacja czy osoba żyje - jeśli nie wywalić z pamięci
