//------------------------- 1. osa Ostukorv -------------------------

"use strict";

let korv = [];

const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');


// Toote lisamine ostukorvi

lisaKorviNupud.forEach(lisaKorviNupp => {

    lisaKorviNupp.addEventListener("click", () => {

        const toodeInfo = lisaKorviNupp.parentNode;

        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: Number(toodeInfo.querySelector(".toode_hind").innerText),
            kogus: 1
        };

        const onKorvis = korv.some(
            korvArtikkel => korvArtikkel.nimi === toode.nimi
        );

        if (!onKorvis) {

            lisaArtikkel(toode);

            korv.push(toode);

            nupuOhjamine(lisaKorviNupp, toode);

            uuendaKorviSumma();
        }

    });

});


// Funktsioon toote kuvamiseks ostukorvis

function lisaArtikkel(toode) {

    korviSisu.insertAdjacentHTML(
        "beforeend",
        `
        <div class="korv_artikkel">

            <h3 class="korv_artikkel_nimi">
                ${toode.nimi}
            </h3>

            <h3 class="korv_artikkel_hind">
                ${toode.hind}
            </h3>

            <div class="korv_artikkel_buttons">

                <button
                    class="btn-small"
                    data-action="vahenda_artikkel">
                    &minus;
                </button>

                <h3 class="korv_artikkel_kogus">
                    ${toode.kogus}
                </h3>

                <button
                    class="btn btn-small"
                    data-action="suurenda_artikkel">
                    &plus;
                </button>

                <button
                    class="btn btn-small"
                    data-action="eemalda_artikkel">
                    &times;
                </button>

            </div>

        </div>
        `
    );

    lisaKorviJalus();
}


// Ostukorvi nuppude funktsioonid

function nupuOhjamine(lisaKorviNupp, toode) {

    lisaKorviNupp.innerText = "Ostukorvis";
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll(".korv_artikkel");

    korvArtiklidD.forEach(korvArtikkelD => {

        const nimi = korvArtikkelD
            .querySelector(".korv_artikkel_nimi")
            .innerText;

        if (nimi === toode.nimi) {

            korvArtikkelD
                .querySelector('[data-action="suurenda_artikkel"]')
                .addEventListener(
                    "click",
                    () => suurendaArtikkel(toode, korvArtikkelD)
                );

            korvArtikkelD
                .querySelector('[data-action="vahenda_artikkel"]')
                .addEventListener(
                    "click",
                    () => vahendaArtikkel(
                        toode,
                        korvArtikkelD,
                        lisaKorviNupp
                    )
                );

            korvArtikkelD
                .querySelector('[data-action="eemalda_artikkel"]')
                .addEventListener(
                    "click",
                    () => eemaldaArtikkel(
                        toode,
                        korvArtikkelD,
                        lisaKorviNupp
                    )
                );

        }

    });

}


// Toote koguse suurendamine

function suurendaArtikkel(toode, korvArtikkelD) {

    korv.forEach(korvArtikkel => {

        if (korvArtikkel.nimi === toode.nimi) {

            korvArtikkel.kogus++;

            korvArtikkelD
                .querySelector(".korv_artikkel_kogus")
                .innerText = korvArtikkel.kogus;

        }

    });

    uuendaKorviSumma();

}


// Ülesanne 5.1
// Toote koguse vähendamine

function vahendaArtikkel(
    toode,
    korvArtikkelD,
    lisaKorviNupp
) {

    const korvArtikkel = korv.find(
        artikkel => artikkel.nimi === toode.nimi
    );

    if (!korvArtikkel) {
        return;
    }

    if (korvArtikkel.kogus > 1) {

        korvArtikkel.kogus--;

        korvArtikkelD
            .querySelector(".korv_artikkel_kogus")
            .innerText = korvArtikkel.kogus;

        uuendaKorviSumma();

    } else {

        eemaldaArtikkel(
            toode,
            korvArtikkelD,
            lisaKorviNupp
        );

    }

}


// Toote eemaldamine ostukorvist

function eemaldaArtikkel(
    toode,
    korvArtikkelD,
    lisaKorviNupp
) {

    korvArtikkelD.remove();

    korv = korv.filter(
        korvArtikkel => korvArtikkel.nimi !== toode.nimi
    );

    lisaKorviNupp.innerText = "Lisa ostukorvi";
    lisaKorviNupp.disabled = false;

    uuendaKorviSumma();

    if (korv.length < 1) {

        const korvJalus = document.querySelector(".korv-jalus");

        if (korvJalus) {
            korvJalus.remove();
        }

    }

}


// Ostukorvi jaluse lisamine

function lisaKorviJalus() {

    if (document.querySelector(".korv-jalus") === null) {

        korviSisu.insertAdjacentHTML(
            "afterend",
            `
            <div class="korv-jalus">

                <div class="korv-summad">

                    <p>
                        Tooted:
                        <strong>
                            <span id="korv-tooted">0.00</span> €
                        </strong>
                    </p>

                    <p>
                        Tarne:
                        <strong>
                            <span id="korv-tarne">0.00</span> €
                        </strong>
                    </p>

                    <p class="korv-kokku-rida">
                        Kokku:
                        <strong>
                            <span id="korv-kokku">0.00</span> €
                        </strong>
                    </p>

                </div>


                <div class="korv-nupud">

                    <button
                        class="btn"
                        data-action="tyhjenda_korv">
                        Tühjenda ostukorv
                    </button>

                    <button
                        class="btn"
                        data-action="kassa">
                        Maksma
                    </button>

                </div>

            </div>
            `
        );

        document
            .querySelector('[data-action="tyhjenda_korv"]')
            .addEventListener(
                "click",
                tuhjendaKorv
            );

        document
            .querySelector('[data-action="kassa"]')
            .addEventListener(
                "click",
                kassa
            );

    }

}


// Ostukorvi tühjendamine

function tuhjendaKorv() {

    korviSisu
        .querySelectorAll(".korv_artikkel")
        .forEach(korvArtikkelD => {

            korvArtikkelD.remove();

        });

    korv = [];

    const korvJalus = document.querySelector(".korv-jalus");

    if (korvJalus) {
        korvJalus.remove();
    }

    lisaKorviNupud.forEach(lisaOstukorviNupp => {

        lisaOstukorviNupp.innerText = "Lisa ostukorvi";
        lisaOstukorviNupp.disabled = false;

    });

}


// Ülesanne 5.2
// Ostukorvi toodete hinna arvutamine

function arvutaKorviSumma() {

    return korv.reduce(
        (summa, toode) =>
            summa + toode.hind * toode.kogus,
        0
    );

}


// BOONUSÜLESANNE
// Tarne hind lisatakse ostukorvi maksumusele

function uuendaKorviSumma() {

    const toodeteSumma = arvutaKorviSumma();

    const valitudTarneviis = document.querySelector(
        'input[name="tarneviis"]:checked'
    );

    let tarneHind = 0;

    if (valitudTarneviis) {

        tarneHind = Number(
            valitudTarneviis.dataset.hind
        );

    }

    const kogusumma = toodeteSumma + tarneHind;

    const toodeteVali = document.getElementById("korv-tooted");
    const tarneVali = document.getElementById("korv-tarne");
    const summaVali = document.getElementById("korv-kokku");

    if (toodeteVali) {
        toodeteVali.innerText = toodeteSumma.toFixed(2);
    }

    if (tarneVali) {
        tarneVali.innerText = tarneHind.toFixed(2);
    }

    if (summaVali) {
        summaVali.innerText = kogusumma.toFixed(2);
    }

}


// Tarneviisi muutmisel arvutatakse summa uuesti

const tarneNupud = document.querySelectorAll(
    'input[name="tarneviis"]'
);

tarneNupud.forEach(tarneNupp => {

    tarneNupp.addEventListener(
        "change",
        uuendaKorviSumma
    );

});



//------------------------- 2. osa Taimer -------------------------


let taimerInterval = null;


// Taimer

function alustaTaimer(kestvus, kuva) {

    if (taimerInterval !== null) {

        clearInterval(taimerInterval);

    }

    const start = Date.now();


    function taimer() {

        const vahe =
            kestvus -
            Math.floor(
                (Date.now() - start) / 1000
            );

        if (vahe < 0) {

            clearInterval(taimerInterval);

            taimerInterval = null;

            kuva.textContent = "aeg sai läbi";

            return;
        }

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }

        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuva.textContent =
            minutid + ":" + sekundid;

    }

    taimer();

    taimerInterval = setInterval(
        taimer,
        1000
    );

}


// Lisaülesanne:
// taimer käivitub alles "Maksma" vajutamisel

function kassa() {

    const taimeriAeg = 60 * 2;

    const kuva = document.getElementById("time");

    alustaTaimer(
        taimeriAeg,
        kuva
    );

}



//------------------------- 3. osa Tarne vorm -------------------------


const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const errorMessage = document.getElementById("errorMessage");


// minu kood

const postiindeks = document.getElementById("postiindeks");

// minu kood


form.addEventListener("submit", e => {

    e.preventDefault();

    const errors = [];


    // Nimi ei tohi sisaldada numbreid

    const nimeMuster = /^[^0-9]+$/;


    // Telefon peab koosnema ainult numbritest
    // ja olema vähemalt 6 numbrit pikk

    const telefoniMuster = /^[0-9]{6,}$/;


    // Eesnime kontroll

    if (eesnimi.value.trim() === "") {

        errors.push(
            "Sisesta eesnimi"
        );

    } else if (
        !nimeMuster.test(eesnimi.value.trim())
    ) {

        errors.push(
            "Eesnimi ei tohi sisaldada numbreid"
        );

    }


    // Perenime kontroll

    if (perenimi.value.trim() === "") {

        errors.push(
            "Sisesta perenimi"
        );

    } else if (
        !nimeMuster.test(perenimi.value.trim())
    ) {

        errors.push(
            "Perenimi ei tohi sisaldada numbreid"
        );

    }


    // Telefoni kontroll

    if (
        !telefoniMuster.test(
            telefon.value.trim()
        )
    ) {

        errors.push(
            "Telefon peab sisaldama ainult numbreid ja olema vähemalt 6 numbrit pikk"
        );

    }


    // Tarneviisi kontroll

    const valitudTarneviis = document.querySelector(
        'input[name="tarneviis"]:checked'
    );

    if (!valitudTarneviis) {

        errors.push(
            "Vali tarneviis"
        );

    }


    // Tingimustega nõustumise kontroll

    if (!kinnitus.checked) {

        errors.push(
            "Palun nõustu tingimustega"
        );

    }


    // minu kood
    // Postiindeks peab olema täpselt 5 numbrit

    if (
        !/^\d{5}$/.test(
            postiindeks.value.trim()
        )
    ) {

        errors.push(
            "Postiindeks peab koosnema täpselt viiest numbrist"
        );

    }

    // minu kood


    // Vigade kuvamine

    if (errors.length > 0) {

        errorMessage.className = "error-box";

        errorMessage.innerHTML = `
            <strong>Palun kontrolli järgmisi välju:</strong>

            <ul>
                ${errors
                    .map(error => `<li>${error}</li>`)
                    .join("")}
            </ul>
        `;

    } else {

        errorMessage.className = "success-box";

        errorMessage.innerHTML =
            "Kõik väljad on korrektselt täidetud.";

    }

});