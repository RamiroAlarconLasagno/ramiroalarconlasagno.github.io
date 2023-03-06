var pozosConfig = {};
var markers = [];
var map = {};
var mainPlotDynaObj = {};
var plotHitoricData = [
    {
        x: [],
        y: [],
        name: 'Trabajo',
        type: 'scatter',
        mode: "markers",
    }
    ,
    {
        x: [],
        y: [],
        type: 'scatter',
        mode: "markers",
        name: 'Fuerza Max',
        yaxis: 'y2',

    }
    ,
    {
        x: [],
        y: [],
        type: 'scatter',
        mode: "markers",
        name: 'Fuerza Min',
        yaxis: 'y2'

    }
    ,
    {
        x: [],
        y: [],
        type: 'scatter',
        mode: "markers",
        name: '(GPM)',
        yaxis: 'y3'

    }


];

var dinas = [];
var tr = [];
var pozoActual = "";

// main-plot-dyna
var mainPlotDynaData = [
    {
        x: [],
        y: [],
        mode: "lines",
        line: {
            color: 'rgb( 0, 0, 255)',
            width: 2
        }
    },
    {
        x: [],
        y: [],
        mode: "lines",
        line: {
            color: 'rgb(128, 128, 128)',
            width: 3
        }

    },
    {
        x: [],
        y: [],
        mode: "lines",
        line: {
            color: 'rgb( 128, 0, 128 )',
            width: 2
        }

    },
    {
        x: [],
        y: [],
        mode: "lines",
        line: {
            color: 'rgb(128, 128, 128)',
            width: 3
        }

    }
];


var mainPlotDynalayout = {
    xaxis: { range: [-20, 200] }, //, title: "Posición (pulgadas)"
    yaxis: { range: [-5000, 30000] }, //, title: "Fuerza (libras)" 
    //title: `Dinamometria Pozo:${obj.pozo.name}`
    margin: { t:20, b:30, l:30, r:20 },
    showlegend: false,
    legend: {
        x: 1,
        xanchor: 'right',
        y: 1
    }
};


    var mainPlotHistoricLayout = {
        //title: 'multiple y-axes example',
        //width: 800,
        //xaxis: { domain: [0.3, 0.7] },
        margin: { t: 20, b: 20, l: 40, r: 20 },
        yaxis: {
            title: 'Trabajo (Klibres x Pulgadas)',
            titlefont: { color: '#1f77b4' },
            tickfont: { color: '#1f77b4' },
            rangemode: 'tozero',
            autorange: true,
        },
        yaxis2: {
            title: 'Fuerza min-max (libras)',
            titlefont: { color: '#ff7f0e' },
            tickfont: { color: '#ff7f0e' },
            anchor: 'free',
            overlaying: 'y',
            side: 'right',
            position: 5,
            rangemode: 'tozero',
            autorange: true,
        }
        ,
        yaxis3: {
            title: '(GPM)',
            titlefont: { color: '#d62728' },
            tickfont: { color: '#d62728' },
            anchor: 'x',
            overlaying: 'y',
            side: 'right',
            rangemode: 'tozero',
            range: [0, 15],
            //autorange: true,

        },
        //yaxis4: {
        //    title: 'yaxis5 title',
        //    titlefont: { color: '#9467bd' },
        //    tickfont: { color: '#9467bd' },
        //    anchor: 'free',
        //    overlaying: 'y',
        //    side: 'right',
        //    position: 0.85
        //}
    };

    //];

var mainPlotHistoricLayout2 = {
        //xaxis: { range: ['2013-08-04 22:23:00', '2015-12-04 22:23:00'] }, //, title: "Posición (pulgadas)"
        yaxis: { rangemode: 'tozero', autorange: true }, //, title: "Fuerza (libras)"
        //title: `Dinamometria Pozo:${obj.pozo.name}`

        margin: { t: 30 }
    };



const image = "http://test.capsa.rfindustrial.com/IMG/AIB.png";
const markerIcons =
{
    "OK": "http://maps.google.com/mapfiles/ms/icons/green.png",
    "ND": "http://maps.google.com/mapfiles/ms/icons/yellow.png",
    "DESCONECTADO": "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    "FAIL": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "STOP": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    "Stopped": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
}
var historico = {};
//{
//    url: "http://test.capsa.rfindustrial.com/IMG/AIB_mini.png",
//    size: new google.maps.Size(20, 32),
//    // The origin for this image is (0, 0).
//    origin: new google.maps.Point(0, 0),
//    // The anchor for this image is the base of the flagpole at (0, 32).
//    anchor: new google.maps.Point(0, 32)
//};

$(document).ready(function () {



    window.onresize = function () {

        Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);
        Plotly.newPlot('plot-historico', plotHitoricData, mainPlotHistoricLayout, { displayModeBar: false });


    };

    //Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);

    let cambio = document.getElementById("cambio-modo");
    cambio.addEventListener("click",function () {
        let ver = document.getElementById("view-map");
        if (ver.classList.contains('hide-this')) {
            ver.classList.remove('hide-this');
            cambio.innerText = "ver como TABLA"
        }
        else {
            ver.classList.add('hide-this');
            cambio.innerText = "ver como MAPA"
        }
    });


    $.ajax({
        dataType: 'json',
        url: "/Dynas/Dynamometers.json",
        type: 'get',

        success: function (pozoList) {


            //const infoWindow = new google.maps.InfoWindow();

            var table = document.getElementById("main-table");
            //var dynas = $.parseJSON(data);

            $.each(pozoList, function (idx, obj) {

                dinas[obj.pozo.name] = obj;
                const date1 = new Date(obj.pozo.lastDyna.date);
                const date2 = Date.now();
                const diffDays = (date2- date1) / (1000 * 60 * 60 * 24);
                if ((diffDays) > 1 ) {
                    obj.pozo.lastDyna.diagnostic = "DESCONECTADO";
                }
                let mitr = document.createElement("tr");
                mitr.setAttribute("id", `pozo-${obj.pozo.name}`);
                mitr.setAttribute("onclick", 'filaClick(this)');
                mitr.setAttribute("class", 'filas-pozo');

                table.appendChild(mitr);

                let td = document.createElement("td");
                td.textContent = obj.pozo.name;
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = obj.pozo.lastDyna.gpm.toFixed(1);
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = (obj.pozo.lastDyna.work / 1000).toFixed(0);
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = (obj.pozo.lastDyna.minForce / 1000).toFixed(0);
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = (obj.pozo.lastDyna.maxForce / 1000).toFixed(0);
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = obj.pozo.lastDyna.diagnostic;
                mitr.appendChild(td);

                td = document.createElement("td");
                td.textContent = obj.pozo.lastDyna.date;
                mitr.appendChild(td);

                mitr.pozo = obj.pozo.name;

                tr[obj.pozo.name] = mitr;


                var marker = new google.maps.Marker({
                    position: obj.pozo.position,
                    map: map,
                    //title: obj.pozo.name,
                    icon: markerIcons[obj.pozo.lastDyna.diagnostic],
                    optimized: false,
                    label: { text: obj.pozo.name, color: "white" },
                });

                marker.namePozo = obj.pozo.name;

                marker.addListener('mouseover', () => {
                    filaClick(tr[marker.namePozo]);
                });

                marker.addListener('mouseout', () => {
                    filaClick(tr[pozoActual]);
                });


                marker.addListener("click", () => {
                    filaClick(tr[marker.namePozo]);
                    pozoActual = marker.namePozo;
                    document.getElementById("info").innerText = pozoActual;
                    //marker.setIcon ( image);
                });

                markers.push(markers);


                //if (idx == 0) {
                //    mainPlotDynaData[0].x = obj.pozo.lastDyna.position;
                //    mainPlotDynaData[0].y = obj.pozo.lastDyna.force;
                //    Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);
                //}
                

                $.ajax({
                    dataType: 'json',
                    url: `/Dynas/Pozos/${obj.pozo.name}`,
                    type: 'get',

                    success: function (dList) {

                        var dinasCount = dList.length - 1;
                        historico[obj.pozo.name] = dList;

                        if (idx == 0) {
                            filaClick(mitr);
                            pozoActual = obj.pozo.name;
                            document.getElementById("info").innerText = pozoActual;
                        }

                        //  let butBack = jQuery(`<button/>`, {
                        //      text: '<',
                        //      id: `button-back-${obj.pozo.name}`,
                        //      pozoname: obj.pozo.name ,
                        //      click: function () {
                        //         // $(`#time-dyna-pozo-${obj.pozo.name}`).text("loco");
                        //          if (idx > 0) {
                        //              idx--;
                        //              lDyna = [{
                        //                  x: historico[obj.pozo.name][idx].position,
                        //                  y: historico[obj.pozo.name][idx].force,
                        //                  mode: "lines"
                        //              }];
                        //              Plotly.newPlot(`last-dyna-pozo-${obj.pozo.name}`, lDyna, layout);
                        //  
                        //              this.nextElementSibling.disabled = false;
                        //  
                        //              if (idx == 0) {
                        //                  this.disabled = true;
                        //              }
                        //          }
                        //  
                        //      }
                        //  }).appendTo(`#last-dyna-pozo-${obj.pozo.name}`);
                        //  
                        //  let butFoward = jQuery(`<button/>`, {
                        //      text: '>',
                        //      id: `button-back-${obj.pozo.name}`,
                        //      pozoname: obj.pozo.name,
                        //      click: function () {
                        //          //$(`#time-dyna-pozo-${obj.pozo.name}`).text("loco");
                        //          if (idx  < dList.length - 1) {
                        //              idx++;
                        //              lDyna = [{
                        //                  x: historico[obj.pozo.name][idx].position,
                        //                  y: historico[obj.pozo.name][idx].force,
                        //                  mode: "lines"
                        //              }];
                        //              Plotly.newPlot(`last-dyna-pozo-${obj.pozo.name}`, lDyna, layout);
                        //  
                        //              this.previousElementSibling.disabled = false;
                        //  
                        //              if (idx == dList.length - 1) {
                        //                  this.disabled= true;
                        //              }
                        //          }
                        //  
                        //      }
                        //  }).appendTo(`#last-dyna-pozo-${obj.pozo.name}`);
                        //  

                    }
                });
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("some error");
        }
    });
});

function filaClick(element) {
    const filas = $('.filas-pozo');
    var contaDynaPlot = 1;

    $.each(filas, function (index, value) {
        value.style["background"] = "white";
    });
    element.style["background"] = "green"; 
 
    var misDinas = {};
    let ultimo = "";

    plotHitoricData[0].x = [];
    plotHitoricData[0].y = [];

    plotHitoricData[1].x = [];
    plotHitoricData[1].y = [];

    plotHitoricData[2].x = [];
    plotHitoricData[2].y = [];

    plotHitoricData[3].x = [];
    plotHitoricData[3].y = [];

    $.each(historico[element.pozo], function (idx, obj) {
        if (obj.diagnostic !== "FAIL") {
            misDinas[obj.date] = obj;// { force: obj.force, position: obj.position };
            plotHitoricData[0].x.push(obj.date);
            plotHitoricData[0].y.push((obj.work / 1000).toFixed(0));
            plotHitoricData[1].x.push(obj.date);
            plotHitoricData[1].y.push((obj.maxForce / 1000).toFixed(2));
            plotHitoricData[2].x.push(obj.date);
            plotHitoricData[2].y.push((obj.minForce / 1000).toFixed(2));
            plotHitoricData[3].x.push(obj.date);
            plotHitoricData[3].y.push((obj.gpm / 1).toFixed(2));
            ultimo = obj.date;
        }
    });

    mainPlotDynaData[0].name = ultimo;
    mainPlotDynaData[0].x = misDinas[ultimo].position;
    mainPlotDynaData[0].y = misDinas[ultimo].force;

    mainPlotDynaData[2].x = misDinas[ultimo].dHposition;
    mainPlotDynaData[2].y = misDinas[ultimo].dHforce;

    Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);


    document.getElementById("info-wellname").innerText = misDinas[ultimo].wellName;
    document.getElementById("info-gpm").innerText = misDinas[ultimo].gpm.toFixed(1);
    document.getElementById("info-work").innerText =        (misDinas[ultimo].work / 1000).toFixed(0);
    document.getElementById("info-minforce").innerText =    (misDinas[ultimo].minForce / 1000).toFixed(0);
    document.getElementById("info-maxforce").innerText = (misDinas[ultimo].maxForce / 1000).toFixed(0);
    document.getElementById("info-dia").innerText = misDinas[ultimo].date.substr(0, 10);
    document.getElementById("info-hora").innerText = misDinas[ultimo].date.substr(10);
    document.getElementById("info-diagnostic").innerText =  misDinas[ultimo].diagnostic;


    Plotly.newPlot('plot-historico', plotHitoricData, mainPlotHistoricLayout, { displayModeBar: false });
    var plotHistorico = document.getElementById("plot-historico");

    plotHistorico.on('plotly_hover', function (data) {
        console.log(data.points[0].x);
        let xLocal = data.points[0].x;
        mainPlotDynaData[1].name = xLocal;
        mainPlotDynaData[1].x = misDinas[xLocal].position;
        mainPlotDynaData[1].y = misDinas[xLocal].force;

        mainPlotDynaData[3].x = misDinas[xLocal].dHposition;
        mainPlotDynaData[3].y = misDinas[xLocal].dHforce;

        Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);
    });

    plotHistorico.on('plotly_unhover', function (data) {
        console.log(data.points[0].x);
        let xLocal = data.points[0].x;
        mainPlotDynaData[1].x = [];
        mainPlotDynaData[1].y = [];

        mainPlotDynaData[3].x = [];
        mainPlotDynaData[3].y = [];


        Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);
    });


    plotHistorico.on('plotly_click', function (data) {
        console.log(data.points[0].x);
        let xLocal = data.points[0].x;

        mainPlotDynaData[0].name = xLocal;
        mainPlotDynaData[0].x = misDinas[xLocal].position;
        mainPlotDynaData[0].y = misDinas[xLocal].force;

        mainPlotDynaData[2].x = misDinas[xLocal].dHposition;
        mainPlotDynaData[2].y = misDinas[xLocal].dHforce;


        mainPlotDynaData[contaDynaPlot] = {
            x: [],
            y: [],
            mode: "lines",
            line: {
                color: 'rgb(128, 128, 128)',
                width: 3

            }
        };
        Plotly.newPlot('main-plot-dyna', mainPlotDynaData, mainPlotDynalayout);


        document.getElementById("info-wellname").innerText = misDinas[xLocal].wellName;
        document.getElementById("info-gpm").innerText = misDinas[xLocal].gpm.toFixed(1);
        document.getElementById("info-work").innerText = (misDinas[xLocal].work / 1000).toFixed(0);
        document.getElementById("info-minforce").innerText = (misDinas[xLocal].minForce / 1000).toFixed(0);
        document.getElementById("info-maxforce").innerText = (misDinas[xLocal].maxForce / 1000).toFixed(0);
        document.getElementById("info-dia").innerText = misDinas[ultimo].date.substr(0, 10);
        document.getElementById("info-hora").innerText = misDinas[ultimo].date.substr(10);
        document.getElementById("info-diagnostic").innerText = misDinas[xLocal].diagnostic;

        //contaDynaPlot++;
        //mainPlotDynaData[contaDynaPlot] = {}
    });

}


function iniciarMap() {
    var coord = { lat: -45.772768, lng: -67.683881 }; //-45.772768, -67.683881)
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: coord,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
    });
}

function ocultarTabla(element) {
    let parent = element.parentElement;
    let anterior = parent.previousElementSibling;
    anterior.classList.remove('hide-this');
}

function plotHistoric() {
}

function tiempoTRancurrido(timeDiff) {

    // get seconds(Original had 'round' which incorrectly counts 0: 28, 0: 29, 1: 30 ... 1: 59, 1: 0) 
    var seconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60); // get minutes 
    var minutes = Math.round(timeDiff % 60); // remove minutes from the date 
    timeDiff = Math.floor(timeDiff / 60); // get hours 
    var hours = Math.round(timeDiff % 24); // remove hours from the date 
    timeDiff = Math.floor(timeDiff / 24); // the rest of timeDiff is number of days 
    var days = timeDiff;

    //Fuente: https://www.iteramos.com/pregunta/43339/computar-el-tiempo-transcurrido

}