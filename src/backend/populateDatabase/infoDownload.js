const mysql = require("mysql2");
const fs = require("fs");
const axios = require("axios");
const { log } = require("console");

var config = {
  host: "rateem-server.mysql.database.azure.com",
  user: "GodAdmin",
  password: "ZAQ!2wsx",
  database: "ratem",
  port: 3306,
  ssl: { ca: fs.readFileSync("./src/backend/populateDatabase/DigiCertGlobalRootCA.crt.pem") },
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
  }

  async sejmKadencja() {
    try {
      // pobiera z API daty poprzednich wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=o%20wynikach%20wyborów%20do%20sejmu%20rzeczypospolitej%20polskiej%20&type=Obwieszczenie`;
      const response = await fetch(url);
      this.sejmWszystkieKadencje = await response.json();

      this.sejmWszystkieKadencje.items.forEach((sejmKadencja_info) => {
        var date = sejmKadencja_info.title.split("przeprowadzonych w dniu ")[1];
        date = date.split(" r.")[0];
        date = this.makeDateAppropriate(date);
        date = date[2] + "-" + date[1] + "-" + date[0];

        this.sejmKadencje.push(date);
      });
    } catch (error) {
      return null;
    }

    try {
      // szacuje date przyszłych wyborów
      const url = `https://api.sejm.gov.pl/sejm/term`;
      const response = await fetch(url);
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
      return null;
    }
  }

  async prezydentKadencja() {
    try {
      // pobiera z API daty poprzednich wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=wyniku%20wyborów%20prezydenta%20rzeczypospolitej%20polskiej%20&type=Obwieszczenie`;
      const response = await fetch(url);
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
      return null;
    }

    try {
      // szacuje date przyszłych wyborów
      const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=MP&title=złożenia%20przysięgi%20przez%20nowo%20wybranego%20Prezydenta%20Rzeczypospolitej%20Polskiej&type=Protokół`;
      const response = await fetch(url);
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

      this.prezydentKadencje.unshift(date);
    } catch (error) {
      return null;
    }
  }

  async euKadencja() {
    const url = `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&title=o%20wynikach%20wyborów%20posłów%20do%20Parlamentu%20Europejskiego%20przeprowadzonych%20w%20dniu&type=Obwieszczenie`;

    try {
      // pobiera z API
      const response = await fetch(url);
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
      return null;
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
      this.sejmWszystkieKadencje = await response.json();
      this.sejmWszystkieKadencje.reverse();

      // pobiera wszystkich posłów dla każdej kadencji
      for (const kadencja of this.sejmWszystkieKadencje) {
        // zaczynaja od 8 kadencji, żeby nie było za dużo nieaktualnych osób
        if (kadencja.num >= 8) {
          const url = `https://api.sejm.gov.pl/sejm/term${kadencja.num}/MP`;
          const response = await fetch(url);
          var sejmKadencjaPolitycy = await response.json();

          await this.getSejmClubsFullNames();

          for (const osoba of sejmKadencjaPolitycy) {
            // przed dodaniem do listy waliduje czy taka osoba już w niej nie jest
            if (!this.politycy.some((e) => e.fullName.toLowerCase() == osoba.firstLastName.toLowerCase())) {
              var osobaTemp = {};
              osobaTemp.fullName = osoba.firstLastName;
              osobaTemp.firstName = osoba.secondName ? osoba.firstName + " " + osoba.secondName : osoba.firstName;
              osobaTemp.lastName = osoba.lastName;
              osobaTemp.partiaSkrot = osoba.club ? osoba.club : "";
              osobaTemp.partia = this.getClubFullName(osobaTemp.partiaSkrot);
              osobaTemp.dataUrodzenia = osoba.birthDate;

              try {
                const photoResponse = await axios.get(`https://api.sejm.gov.pl/sejm/term${kadencja.num}/MP/${osoba.id}/photo`, {
                  responseType: "arraybuffer",
                });
                const base64Photo = Buffer.from(photoResponse.data, "binary").toString("base64");
                osobaTemp.zdjecie = base64Photo;
              } catch (error) {
                osobaTemp.zdjecie = "";
              }

              osobaTemp.linkFacebook = "";
              osobaTemp.linkTweeter = "";

              this.politycy.push(osobaTemp);
            }
          }
        }
      }
    } catch (error) {
      return null;
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
            return;
          } else {
            var euKadencjaPolitycy = await response.json();

            for (const osoba of euKadencjaPolitycy.data) {
              // przed dodaniem do listy waliduje czy taka osoba już w niej nie jest
              if (!this.politycy.some((e) => e.fullName.toLowerCase() == osoba.givenName.toLowerCase() + " " + osoba.familyName.toLowerCase())) {
                // pobiera szczegółowe info o eu parlamentarzystach
                const url = `https://data.europarl.europa.eu/api/v2/meps/${osoba.identifier}?format=application%2Fld%2Bjson`;
                const response = await fetch(url);
                if (!response.ok) {
                } else {
                  var politykSzczegoly = await response.json();

                  var osobaTemp = {};
                  osobaTemp.fullName = osoba.givenName + " " + osoba.familyName;
                  osobaTemp.firstName = osoba.givenName;
                  osobaTemp.lastName = osoba.familyName;
                  osobaTemp.partiaSkrot = "";
                  osobaTemp.partia = "";
                  osobaTemp.dataUrodzenia = politykSzczegoly.data[0].bday;

                  try {
                    const photoResponse = await axios.get(politykSzczegoly.data[0].img, {
                      responseType: "arraybuffer",
                    });
                    const base64Photo = Buffer.from(photoResponse.data, "binary").toString("base64");
                    osobaTemp.zdjecie = base64Photo;
                  } catch (error) {
                    osobaTemp.zdjecie = "";
                  }

                  if (politykSzczegoly.data[0].hasGender.includes("FEMALE")) {
                    osobaTemp.gender = "female";
                  } else if (politykSzczegoly.data[0].hasGender.includes("MALE")) {
                    osobaTemp.gender = "male";
                  } else {
                    osobaTemp.gender = "pokemon";
                  }

                  for (const membership of politykSzczegoly.data[0].hasMembership) {
                    if (membership.membershipClassification == "def/ep-entities/NATIONAL_CHAMBER") {
                      let clubInfo = await this.getEuClubName(membership.organization, osobaTemp.gender);
                      if (clubInfo) {
                        osobaTemp.partiaSkrot = clubInfo.partyShort;
                        osobaTemp.partia = clubInfo.party;
                      }
                    }
                  }

                  if (politykSzczegoly.data[0].account !== undefined) {
                    for (const link in politykSzczegoly.data[0].account) {
                      if (politykSzczegoly.data[0].account[link].id.includes("facebook")) {
                        osobaTemp.linkFacebook = politykSzczegoly.data[0].account[link].id;
                      } else {
                        osobaTemp.linkFacebook = "";
                      }
                      if (politykSzczegoly.data[0].account[link].id.includes("twitter")) {
                        osobaTemp.linkTweeter = politykSzczegoly.data[0].account[link].id;
                      } else {
                        osobaTemp.linkTweeter = "";
                      }
                    }
                  } else {
                    osobaTemp.linkFacebook = "";
                    osobaTemp.linkTweeter = "";
                  }
                }

                this.politycy.push(osobaTemp);
              }
            }
          }
        }
      }
    } catch (error) {
      return null;
    }
  }

  // pobiera pełne nazwy klubów parlamentarnych
  async getSejmClubsFullNames() {
    for (const kadencja of this.sejmWszystkieKadencje) {
      // zaczynaja od 8 kadencji, żeby nie było za dużo nieaktualnych osób
      if (kadencja.num >= 8) {
        const url = `https://api.sejm.gov.pl/sejm/term${kadencja.num}/clubs`;
        const response = await fetch(url);
        var partieKadencja = await response.json();

        for (const partie of partieKadencja) {
          if (!this.partie.some((e) => e.name == partie.id)) {
            var partieTemp = {};
            partieTemp.name = partie.id;
            partieTemp.fullName = partie.name;

            this.partie.push(partieTemp);
          }
        }
      }
    }
  }

  async getEuClubName(orgId, gender) {
    orgId = orgId.split("/")[1];

    const url = `https://data.europarl.europa.eu/api/v2/corporate-bodies/${orgId}?format=application%2Fld%2Bjson`;
    const response = await fetch(url);
    var clubInfo = (await response.json()).data[0];

    // Independent
    if (clubInfo.label == "Independent" || clubInfo.prefLabel.pl == "Independent" || clubInfo.label == "-" || clubInfo.prefLabel.pl == "-") {
      if (gender == "female") {
        return { party: "niezależna", partyShort: "niezależna" };
      } else if (gender == "male") {
        return { party: "niezależny", partyShort: "niezależny" };
      } else {
        return { party: "niezależne", partyShort: "niezależne" };
      }
    } else {
      return { party: clubInfo.prefLabel.pl, partyShort: clubInfo.label };
    }
  }

  // zwraca pełną nazwę partii dla podanego skrótu nazwy partii
  getClubFullName(partiaSkrot) {
    for (const partia of this.partie) {
      if (partia.name == partiaSkrot) {
        return partia.fullName;
      }
    }
    return "";
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

      this.conn.query("REPLACE INTO sejm_elections SET name=?, date=?, future=?;", [name, wybor, przyszle], function (err, results, fields) {
        if (err) throw err;
      });
    }
  }

  uploadKadencjaPrezydent() {
    for (const wybor of this.prezydentKadencje) {
      var name = "prezydent_" + wybor;
      var przyszle = new Date(wybor) > new Date() ? true : false;

      this.conn.query("REPLACE INTO president_elections SET name=?, date=?, future=?;", [name, wybor, przyszle], function (err, results, fields) {
        if (err) throw err;
      });
    }
  }

  uploadKadencjaEu() {
    for (const wybor of this.euKadencje) {
      var name = "eu_" + wybor;
      var przyszle = new Date(wybor) > new Date() ? true : false;

      this.conn.query("REPLACE INTO eu_elections SET name=?, date=?, future=?;", [name, wybor, przyszle], function (err, results, fields) {
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
        } catch (err) {}
      } else {
        try {
          await this.updatePolitician(polityk);
        } catch (err) {}
      }
    }
  }

  async getPolitician(polityk) {
    var conn = new mysql.createConnection(config);
    let resultLength = 0;

    try {
      await conn.connect();
      return new Promise((resolve, reject) => {
        conn.execute("SELECT id, names_surname FROM politicians WHERE names_surname=?;", [polityk.fullName], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resultLength = results.length;
            resolve(resultLength);
          }
        });
      });
    } catch (err) {
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
          "INSERT INTO politicians SET names_surname=?, name=?, surname=?, party_short=?, party=?, birth_date=?, picture=?, facebook_link=?, twitter_link=?;",
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
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
    } catch (err) {
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
          "UPDATE politicians SET name=?, surname=?, party_short=?, party=?, birth_date=?, picture=?, facebook_link=?, twitter_link=? WHERE names_surname=?;",
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
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });
    } catch (err) {
      throw err;
    } finally {
      await conn.end();
    }
  }
}

const infoDownload = new InfoDownload();
infoDownload.main();
