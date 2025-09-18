import React, { useState, useEffect } from "react";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import Spinner from "../../General/Spinner";
import { set } from "react-hook-form";

/*
  Este componente recibe en props.jobs (Viene en props.jobs en lugar de props.quotes proque usamos un contexto preexistente) un array de presupuestos.
  Debe sumar:
    - Cantidad de pliegos agrupados por material y formato (ej: 3000 Pliegos, Obra 80g, 320x470)
    - Cantidad de hojas del paquete comprado al proveedor (ej. 44 Hojas, Obra 80g, 650x950)
    - Cantidad de impresiones agrupadas por impresora (y opcionalmente por material y formato)

    [
    {
        "_id": "6877f0bbe095d4f1cbcec801",
        "quantity": 20,
        "name": "Mongolia",
        "customer": "LemonPunk Ediciones en Llamas",
        "cost": 32725,
        "gain": 27466.16,
        "comission": 0,
        "taxes": 12817.38,
        "total": 73852.54,
        "data": {
            "impositionData": {
                "6865f0386e61f82de7e2ee4a": {
                    "Poses": 8,
                    "totalPliegos": 96,
                    "impositionData": {
                        "printerSelector": {
                            "_id": "674c04af0aa094c02d5ec1d7",
                            "Modelo": "Iridesse",
                            "SerialNumber": "2xL548274",
                            "Fabricante": "Xerox",
                            "Colores": 6,
                            "X_Minimo": 100,
                            "X_Maximo": 1200,
                            "Y_Minimo": 100,
                            "Y_Maximo": 330,
                            "Paginas_por_minuto": 100,
                            "Costo": {
                                "_id": "643edf3c00de9d66b314ad92",
                                "Proceso": "igen color",
                                "Valor": 127.65,
                                "Minimo": 2500,
                                "Entrada": 6238,
                                "Fecha": "2025-07-15T16:31:56.524Z",
                                "__v": 19,
                                "Categoria": "print"
                            },
                            "Fecha": "2024-12-01T06:39:43.500Z",
                            "__v": 9
                        },
                        "widthPage": 51,
                        "heightPage": 51,
                        "Calle": 0,
                        "margenes": 0,
                        "formatSelector": "Personalizado",
                        "widthSheet": 216,
                        "heightSheet": 127,
                        "sheetOriginalSize": {
                            "width": 508,
                            "height": 300
                        }
                    },
                    "totalHojas": 24,
                    "tirada": 3,
                    "id": "6865f0386e61f82de7e2ee4a",
                    "stock": {
                        "_id": "6865efba6e61f82de7e1f0a5",
                        "Nombre_Material": "Provisto Natural Evolution 120",
                        "Marca": "Ledesma",
                        "Gramaje": 120,
                        "Tipo": "Obra",
                        "Ancho_Resma": 720,
                        "Alto_Resma": 1020,
                        "Espesor_Resma": 0,
                        "Fibra": 1020,
                        "Precio_x_Kilo": "6649804ff69b8754661f7051",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "colores": 4,
                    "impresiones": 192
                }
            },
            "resumen": [
                {
                    "printer": {
                        "_id": "674c04af0aa094c02d5ec1d7",
                        "Modelo": "Iridesse",
                        "SerialNumber": "2xL548274",
                        "Fabricante": "Xerox",
                        "Colores": 6,
                        "X_Minimo": 100,
                        "X_Maximo": 1200,
                        "Y_Minimo": 100,
                        "Y_Maximo": 330,
                        "Paginas_por_minuto": 100,
                        "Costo": {
                            "_id": "643edf3c00de9d66b314ad92",
                            "Proceso": "igen color",
                            "Valor": 127.65,
                            "Minimo": 2500,
                            "Entrada": 6238,
                            "Fecha": "2025-07-15T16:31:56.524Z",
                            "__v": 19,
                            "Categoria": "print"
                        },
                        "Fecha": "2024-12-01T06:39:43.500Z",
                        "__v": 9
                    },
                    "stock": {
                        "_id": "6865efba6e61f82de7e1f0a5",
                        "Nombre_Material": "Provisto Natural Evolution 120",
                        "Marca": "Ledesma",
                        "Gramaje": 120,
                        "Tipo": "Obra",
                        "Ancho_Resma": 720,
                        "Alto_Resma": 1020,
                        "Espesor_Resma": 0,
                        "Fibra": 1020,
                        "Precio_x_Kilo": "6649804ff69b8754661f7051",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "format": "Personalizado",
                    "totalPliegos": 96,
                    "widthSheet": 216,
                    "heightSheet": 127,
                    "totalHojas": 24,
                    "impresiones": 192,
                    "sheetOriginalSize": {
                        "width": 508,
                        "height": 300
                    },
                    "key": "Xerox Iridesse - 6865efba6e61f82de7e1f0a5 - undefined - 6865efba6e61f82de7e1f0a5",
                    "printPrice": {
                        "Unitario": 123.67,
                        "Cantidad": 192,
                        "Total": 23744.29
                    },
                    "stockCost": {
                        "surface": 734400,
                        "totalPaper": 17625600,
                        "weight": 2115.0719999999997,
                        "cost": 6980
                    },
                    "FinishingCost": 700
                },
                {
                    "print": 23744.29,
                    "stock": 6980,
                    "finishing": 2000
                }
            ],
            "quoteSettings": {
                "gainPercentage": 45,
                "salesCommission": 0,
                "ivaPercentage": 21,
                "isIvaEnabled": true,
                "quote": {
                    "gain": 27466.16,
                    "utilityPercentage": 81.82,
                    "salesCommission": 0,
                    "iva": 12817.38,
                    "total": 73852.54
                }
            },
            "partsFinishing": [
                {
                    "partId": "6865f0386e61f82de7e2ee4a",
                    "finishingData": 700
                }
            ],
            "finishing": 1300
        },
        "jobId": {
            "_id": "6865f0386e61f82de7e2ee48",
            "Nombre": "Mongolia",
            "id": "6865f0386e61f82de7e2ee48"
        },
        "customerId": "6865ef1f6e61f82de7e161f6",
        "jobType": "Cosido a Hilo",
        "fecha": "2025-07-16T18:34:35.375Z",
        "index": 146,
        "__v": 0
    },
    {
        "_id": "6877963ae095d4f1cbcc7fe4",
        "quantity": 1,
        "name": "Raspaduras en una carbonilla",
        "customer": "Reck Matias",
        "cost": 16082,
        "gain": 12915.47,
        "comission": 0,
        "taxes": 1004.22,
        "total": 30001.69,
        "data": {
            "impositionData": {
                "68767adb56d2373eddd10546": {
                    "Poses": 4,
                    "totalPliegos": 173,
                    "impositionData": {
                        "printerSelector": {
                            "_id": "674c03f30aa094c02d5ec053",
                            "Modelo": "Nuvera 157",
                            "SerialNumber": "TB7000767",
                            "Fabricante": "Xerox",
                            "Colores": 1,
                            "X_Minimo": 350,
                            "X_Maximo": 470,
                            "Y_Minimo": 203,
                            "Y_Maximo": 320,
                            "Paginas_por_minuto": 157,
                            "Costo": {
                                "_id": "643e94709ea18a05e4994e5c",
                                "Proceso": "nuvera",
                                "Valor": 12.84,
                                "Minimo": 10000,
                                "Entrada": 3750,
                                "Fecha": "2025-07-15T16:29:55.673Z",
                                "__v": 21,
                                "Categoria": "print"
                            },
                            "Fecha": "2024-12-01T06:36:35.212Z",
                            "__v": 9
                        },
                        "widthPage": "150",
                        "heightPage": "220",
                        "Calle": "0",
                        "margenes": "0",
                        "formatSelector": {
                            "_id": "64232a930bf812f65f40c0a7",
                            "Nombre": "470 x 320",
                            "Ancho": 470,
                            "Alto": 320,
                            "__v": 0,
                            "Superficie": "150400 mm2",
                            "id": "64232a930bf812f65f40c0a7"
                        },
                        "widthSheet": 470,
                        "heightSheet": 320,
                        "sheetOriginalSize": {
                            "width": 470,
                            "height": 320
                        }
                    },
                    "totalHojas": 44,
                    "tirada": 1,
                    "id": "68767adb56d2373eddd10546",
                    "stock": {
                        "_id": "64841bfd3e111d6d731cbe51",
                        "Nombre_Material": "bookcell 80",
                        "Marca": "Boreal",
                        "Gramaje": 80,
                        "Tipo": "Bookcell",
                        "Ancho_Resma": 950,
                        "Alto_Resma": 650,
                        "Espesor_Resma": 60,
                        "Fibra": 950,
                        "Precio_x_Kilo": "664773b1d46ac4042c9e914c",
                        "Color": "ahuesado",
                        "__v": 0
                    },
                    "colores": 1,
                    "impresiones": 346
                }
            },
            "resumen": [
                {
                    "printer": {
                        "_id": "674c03f30aa094c02d5ec053",
                        "Modelo": "Nuvera 157",
                        "SerialNumber": "TB7000767",
                        "Fabricante": "Xerox",
                        "Colores": 1,
                        "X_Minimo": 350,
                        "X_Maximo": 470,
                        "Y_Minimo": 203,
                        "Y_Maximo": 320,
                        "Paginas_por_minuto": 157,
                        "Costo": {
                            "_id": "643e94709ea18a05e4994e5c",
                            "Proceso": "nuvera",
                            "Valor": 12.84,
                            "Minimo": 10000,
                            "Entrada": 3750,
                            "Fecha": "2025-07-15T16:29:55.673Z",
                            "__v": 21,
                            "Categoria": "print"
                        },
                        "Fecha": "2024-12-01T06:36:35.212Z",
                        "__v": 9
                    },
                    "stock": {
                        "_id": "64841bfd3e111d6d731cbe51",
                        "Nombre_Material": "bookcell 80",
                        "Marca": "Boreal",
                        "Gramaje": 80,
                        "Tipo": "Bookcell",
                        "Ancho_Resma": 950,
                        "Alto_Resma": 650,
                        "Espesor_Resma": 60,
                        "Fibra": 950,
                        "Precio_x_Kilo": "664773b1d46ac4042c9e914c",
                        "Color": "ahuesado",
                        "__v": 0
                    },
                    "format": {
                        "_id": "64232a930bf812f65f40c0a7",
                        "Nombre": "470 x 320",
                        "Ancho": 470,
                        "Alto": 320,
                        "__v": 0,
                        "Superficie": "150400 mm2",
                        "id": "64232a930bf812f65f40c0a7"
                    },
                    "totalPliegos": 173,
                    "widthSheet": 470,
                    "heightSheet": 320,
                    "totalHojas": 44,
                    "impresiones": 346,
                    "sheetOriginalSize": {
                        "width": 470,
                        "height": 320
                    },
                    "key": "Xerox Nuvera 157 - 64841bfd3e111d6d731cbe51 - 64232a930bf812f65f40c0a7 - 64841bfd3e111d6d731cbe51",
                    "printPrice": {
                        "Unitario": 28.9,
                        "Cantidad": 346,
                        "Total": 10000
                    },
                    "stockCost": {
                        "surface": 617500,
                        "totalPaper": 27170000,
                        "weight": 2173.6000000000004,
                        "cost": 4782
                    },
                    "FinishingCost": 1300
                },
                {
                    "print": 10000,
                    "stock": 4782,
                    "finishing": 1300
                }
            ],
            "quoteSettings": {
                "gainPercentage": "43.05",
                "salesCommission": 0,
                "ivaPercentage": 0,
                "isIvaEnabled": false,
                "quote": {
                    "gain": 12915.47,
                    "utilityPercentage": 75.59,
                    "salesCommission": 0,
                    "iva": 1004.22,
                    "total": 30001.69
                }
            },
            "partsFinishing": [
                {
                    "partId": "68767adb56d2373eddd10546",
                    "finishingData": 1300
                }
            ],
            "finishing": 0
        },
        "jobId": {
            "_id": "68767adb56d2373eddd10544",
            "Nombre": "Raspaduras en una carbonilla",
            "id": "68767adb56d2373eddd10544"
        },
        "customerId": "65ddbbf7b69da37426f70bc7",
        "jobType": "Libro",
        "fecha": "2025-07-16T12:08:26.758Z",
        "index": 144,
        "__v": 0
    },
    {
        "_id": "687793a5e095d4f1cbcc726a",
        "quantity": 55,
        "name": "Cuento Fantastico",
        "customer": "Asociación Escuelas Lincoln",
        "cost": 152531,
        "gain": 124800.86,
        "comission": 0,
        "taxes": 58239.69,
        "total": 335571.56,
        "data": {
            "impositionData": {
                "68600c966e61f82de7c2aebb": {
                    "Poses": 2,
                    "totalPliegos": 448,
                    "impositionData": {
                        "printerSelector": {
                            "_id": "674c03a20aa094c02d5ebf04",
                            "Modelo": "versant 3100",
                            "SerialNumber": "8AA146895",
                            "Fabricante": "Xerox",
                            "Colores": 4,
                            "X_Minimo": 146,
                            "X_Maximo": 660,
                            "Y_Minimo": 98,
                            "Y_Maximo": 330,
                            "Paginas_por_minuto": 100,
                            "Costo": {
                                "_id": "643edf3c00de9d66b314ad92",
                                "Proceso": "igen color",
                                "Valor": 127.65,
                                "Minimo": 2500,
                                "Entrada": 6238,
                                "Fecha": "2025-07-15T16:31:56.524Z",
                                "__v": 19,
                                "Categoria": "print"
                            },
                            "Fecha": "2024-12-01T06:35:14.502Z",
                            "__v": 10
                        },
                        "widthPage": "210",
                        "heightPage": "297",
                        "Calle": "0",
                        "margenes": "0",
                        "formatSelector": {
                            "_id": "64232a930bf812f65f40c0a7",
                            "Nombre": "470 x 320",
                            "Ancho": 470,
                            "Alto": 320,
                            "__v": 0,
                            "Superficie": "150400 mm2",
                            "id": "64232a930bf812f65f40c0a7"
                        },
                        "widthSheet": 470,
                        "heightSheet": 320,
                        "sheetOriginalSize": {
                            "width": 470,
                            "height": 320
                        }
                    },
                    "totalHojas": 112,
                    "tirada": 28,
                    "id": "68600c966e61f82de7c2aebb",
                    "stock": {
                        "_id": "6426d0743f8671de5c2439c4",
                        "Nombre_Material": "obra 80",
                        "Marca": "Boreal",
                        "Gramaje": 80,
                        "Tipo": "Obra",
                        "Ancho_Resma": 650,
                        "Alto_Resma": 950,
                        "Espesor_Resma": 56,
                        "Fibra": 950,
                        "Precio_x_Kilo": "66477393d46ac4042c9e900c",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "colores": 4,
                    "impresiones": 896
                },
                "68600c966e61f82de7c2aebd": {
                    "Poses": 1,
                    "totalPliegos": 55,
                    "impositionData": {
                        "printerSelector": {
                            "_id": "674c03a20aa094c02d5ebf04",
                            "Modelo": "versant 3100",
                            "SerialNumber": "8AA146895",
                            "Fabricante": "Xerox",
                            "Colores": 4,
                            "X_Minimo": 146,
                            "X_Maximo": 660,
                            "Y_Minimo": 98,
                            "Y_Maximo": 330,
                            "Paginas_por_minuto": 100,
                            "Costo": {
                                "_id": "643edf3c00de9d66b314ad92",
                                "Proceso": "igen color",
                                "Valor": 127.65,
                                "Minimo": 2500,
                                "Entrada": 6238,
                                "Fecha": "2025-07-15T16:31:56.524Z",
                                "__v": 19,
                                "Categoria": "print"
                            },
                            "Fecha": "2024-12-01T06:35:14.502Z",
                            "__v": 10
                        },
                        "widthPage": "420",
                        "heightPage": "297",
                        "Calle": "0",
                        "margenes": "0",
                        "formatSelector": {
                            "_id": "6537a5b15cb7e7db686d4434",
                            "Nombre": "488 x 330",
                            "Ancho": 488,
                            "Alto": 330,
                            "__v": 0,
                            "Superficie": "161040 mm2",
                            "id": "6537a5b15cb7e7db686d4434"
                        },
                        "widthSheet": 488,
                        "heightSheet": 330,
                        "sheetOriginalSize": {
                            "width": 488,
                            "height": 330
                        }
                    },
                    "totalHojas": 14,
                    "tirada": 55,
                    "id": "68600c966e61f82de7c2aebd",
                    "stock": {
                        "_id": "6487101cf688c0c47257c72b",
                        "Nombre_Material": "Mate 270 (74x110)",
                        "Marca": "Suzanno",
                        "Gramaje": 300,
                        "Tipo": "Ilustracion Mate",
                        "Ancho_Resma": 1100,
                        "Alto_Resma": 740,
                        "Espesor_Resma": 0,
                        "Fibra": 1100,
                        "Precio_x_Kilo": "6647742cd46ac4042c9e93cc",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "colores": 4,
                    "impresiones": 110
                }
            },
            "resumen": [
                {
                    "printer": {
                        "_id": "674c03a20aa094c02d5ebf04",
                        "Modelo": "versant 3100",
                        "SerialNumber": "8AA146895",
                        "Fabricante": "Xerox",
                        "Colores": 4,
                        "X_Minimo": 146,
                        "X_Maximo": 660,
                        "Y_Minimo": 98,
                        "Y_Maximo": 330,
                        "Paginas_por_minuto": 100,
                        "Costo": {
                            "_id": "643edf3c00de9d66b314ad92",
                            "Proceso": "igen color",
                            "Valor": 127.65,
                            "Minimo": 2500,
                            "Entrada": 6238,
                            "Fecha": "2025-07-15T16:31:56.524Z",
                            "__v": 19,
                            "Categoria": "print"
                        },
                        "Fecha": "2024-12-01T06:35:14.502Z",
                        "__v": 10
                    },
                    "stock": {
                        "_id": "6426d0743f8671de5c2439c4",
                        "Nombre_Material": "obra 80",
                        "Marca": "Boreal",
                        "Gramaje": 80,
                        "Tipo": "Obra",
                        "Ancho_Resma": 650,
                        "Alto_Resma": 950,
                        "Espesor_Resma": 56,
                        "Fibra": 950,
                        "Precio_x_Kilo": "66477393d46ac4042c9e900c",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "format": {
                        "_id": "64232a930bf812f65f40c0a7",
                        "Nombre": "470 x 320",
                        "Ancho": 470,
                        "Alto": 320,
                        "__v": 0,
                        "Superficie": "150400 mm2",
                        "id": "64232a930bf812f65f40c0a7"
                    },
                    "totalPliegos": 448,
                    "widthSheet": 470,
                    "heightSheet": 320,
                    "totalHojas": 112,
                    "impresiones": 896,
                    "sheetOriginalSize": {
                        "width": 470,
                        "height": 320
                    },
                    "key": "Xerox versant 3100 - 6426d0743f8671de5c2439c4 - 64232a930bf812f65f40c0a7 - 6426d0743f8671de5c2439c4",
                    "printPrice": {
                        "Unitario": 98.14,
                        "Cantidad": 896,
                        "Total": 87934
                    },
                    "stockCost": {
                        "surface": 617500,
                        "totalPaper": 69160000,
                        "weight": 5532.799999999999,
                        "cost": 9960
                    },
                    "FinishingCost": 1660
                },
                {
                    "printer": {
                        "_id": "674c03a20aa094c02d5ebf04",
                        "Modelo": "versant 3100",
                        "SerialNumber": "8AA146895",
                        "Fabricante": "Xerox",
                        "Colores": 4,
                        "X_Minimo": 146,
                        "X_Maximo": 660,
                        "Y_Minimo": 98,
                        "Y_Maximo": 330,
                        "Paginas_por_minuto": 100,
                        "Costo": {
                            "_id": "643edf3c00de9d66b314ad92",
                            "Proceso": "igen color",
                            "Valor": 127.65,
                            "Minimo": 2500,
                            "Entrada": 6238,
                            "Fecha": "2025-07-15T16:31:56.524Z",
                            "__v": 19,
                            "Categoria": "print"
                        },
                        "Fecha": "2024-12-01T06:35:14.502Z",
                        "__v": 10
                    },
                    "stock": {
                        "_id": "6487101cf688c0c47257c72b",
                        "Nombre_Material": "Mate 270 (74x110)",
                        "Marca": "Suzanno",
                        "Gramaje": 300,
                        "Tipo": "Ilustracion Mate",
                        "Ancho_Resma": 1100,
                        "Alto_Resma": 740,
                        "Espesor_Resma": 0,
                        "Fibra": 1100,
                        "Precio_x_Kilo": "6647742cd46ac4042c9e93cc",
                        "Color": "blanco",
                        "__v": 0
                    },
                    "format": {
                        "_id": "6537a5b15cb7e7db686d4434",
                        "Nombre": "488 x 330",
                        "Ancho": 488,
                        "Alto": 330,
                        "__v": 0,
                        "Superficie": "161040 mm2",
                        "id": "6537a5b15cb7e7db686d4434"
                    },
                    "totalPliegos": 55,
                    "widthSheet": 488,
                    "heightSheet": 330,
                    "totalHojas": 14,
                    "impresiones": 110,
                    "sheetOriginalSize": {
                        "width": 488,
                        "height": 330
                    },
                    "key": "Xerox versant 3100 - 6487101cf688c0c47257c72b - 6537a5b15cb7e7db686d4434 - 6487101cf688c0c47257c72b",
                    "printPrice": {
                        "Unitario": 147.89,
                        "Cantidad": 110,
                        "Total": 16267.64
                    },
                    "stockCost": {
                        "surface": 814000,
                        "totalPaper": 11396000,
                        "weight": 3418.8,
                        "cost": 8206
                    },
                    "FinishingCost": 10892.96
                },
                {
                    "print": 104201.64,
                    "stock": 18166,
                    "finishing": 30162.96
                }
            ],
            "quoteSettings": {
                "gainPercentage": "45",
                "salesCommission": 0,
                "ivaPercentage": 21,
                "isIvaEnabled": true,
                "quote": {
                    "gain": 124800.86,
                    "utilityPercentage": 81.82,
                    "salesCommission": 0,
                    "iva": 58239.69,
                    "total": 335571.56
                }
            },
            "partsFinishing": [
                {
                    "partId": "68600c966e61f82de7c2aebb",
                    "finishingData": 1660
                },
                {
                    "partId": "68600c966e61f82de7c2aebd",
                    "finishingData": 10892.96
                }
            ],
            "finishing": 17610
        },
        "jobId": {
            "_id": "68600c966e61f82de7c2aeb9",
            "Nombre": "Cuento Fantastico",
            "id": "68600c966e61f82de7c2aeb9"
        },
        "customerId": "66576bec06011a3f60d25dd1",
        "jobType": "Revista",
        "fecha": "2025-07-16T11:57:25.704Z",
        "index": 143,
        "__v": 0
    }
]
*/

const StockCount = (props) => {
  const [useError, setError] = useState(null);
  const [useLoading, setLoading] = useState(true);
  const [stockSummary, setStockSummary] = useState([]);
  const [sheetSummary, setSheetSummary] = useState([]);
  const [printerSummary, setPrinterSummary] = useState([]);

  useEffect(() => {
    try {
      // Agrupadores
      const stockMap = {};
      const printerMap = {};
      const sheetMap = {};

      props.jobs.forEach((quote) => {
        if (quote.data && Array.isArray(quote.data.resumen)) {
          quote.data.resumen.forEach((item) => {
            // --- Agrupación de pliegos por material y formato ---
            if (
              item.stock &&
              item.stock.Nombre_Material &&
              item.stock.Gramaje &&
              item.stock.Tipo &&
              item.sheetOriginalSize &&
              item.sheetOriginalSize.width &&
              item.sheetOriginalSize.height &&
              item.totalPliegos
            ) {
              const key = `${item.stock.Nombre_Material} | ${item.stock.Gramaje}g | ${item.stock.Tipo} | ${item.sheetOriginalSize.width}x${item.sheetOriginalSize.height}`;
              stockMap[key] = (stockMap[key] || 0) + Number(item.totalPliegos);
            }

            // --- Agrupación de hojas grandes (resmas) por material y formato de compra ---
            if (
              item.stock &&
              item.stock.Nombre_Material &&
              item.stock.Gramaje &&
              item.stock.Tipo &&
              item.stock.Ancho_Resma &&
              item.stock.Alto_Resma &&
              (item.totalHojas || item.totalhojas)
            ) {
              const key = `${item.stock.Nombre_Material} | ${item.stock.Gramaje}g | ${item.stock.Tipo} | ${item.stock.Ancho_Resma}x${item.stock.Alto_Resma}`;
              const hojas = Number(item.totalHojas ?? item.totalhojas);
              sheetMap[key] = (sheetMap[key] || 0) + hojas;
            }

            // --- Agrupación de impresiones por impresora ---
            if (item.printer && item.printer.Modelo && item.impresiones) {
              const printerKey = item.printer.Modelo;
              printerMap[printerKey] =
                (printerMap[printerKey] || 0) + Number(item.impresiones);
            }
          });
        }
      });

      // Convertir a arrays para renderizar
      const stockArr = Object.entries(stockMap).map(([key, value]) => ({
        key,
        totalPliegos: value,
      }));
      const sheetArr = Object.entries(sheetMap).map(([key, value]) => ({
        key,
        totalHojas: value,
      }));
      const printerArr = Object.entries(printerMap).map(([key, value]) => ({
        printer: key,
        totalImpresiones: value,
      }));

      setStockSummary(stockArr);
      setSheetSummary(sheetArr);
      setPrinterSummary(printerArr);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [props.jobs]);

  if (useLoading) return <Spinner />;
  if (useError) return <ErrorMessage message={useError.message} action={()=>{setError(null)}} title={"Error al cargar datos"} />;

  return (
    <div>
      <h3>Resumen de Pliegos por Material y Formato</h3>
      <ul>
        {stockSummary.sort((a, b) => b.totalPliegos - a.totalPliegos).map((item) => (
          <li key={item.key}>
            <b>{item.totalPliegos}</b> Pliegos - {item.key}
          </li>
        ))}
      </ul>
      <h3>Resumen de Hojas Grandes (Resmas) por Material y Formato</h3>
      <ul>
        {sheetSummary.sort((a, b) => b.totalHojas - a.totalHojas).map((item) => (
          <li key={item.key}>
            <b>{item.totalHojas}</b> Hojas - {item.key}
          </li>
        ))}
      </ul>
      <h3>Resumen de Impresiones por Impresora</h3>
      <ul>
        {printerSummary.map((item) => (
          <li key={item.printer}>
            <b>{item.totalImpresiones}</b> impresiones - {item.printer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockCount;
