import { IAssetsHistoric } from "../../../interfaces/IAssetsHistoric.interface";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "./vfs_fonts";
import { Content, PredefinedPageSize } from "pdfmake/interfaces";
import { StatusAssets } from "../../../enums/statusAssets.enum";

export function createReport(data: IAssetsHistoric[]) {
  pdfMake.vfs = pdfFonts.default;

  function changeColor(status: string) {
    const statusColorMap = {
      Disponível: "#499d6d",
      Alocado: "#6c4b8d",
      Desabilitado: "#bb4040",
      Manutenção: "#ca7b20",
    };

    const assetStatus =
      status === "Alocado"
        ? StatusAssets.Alocated
        : status === "Disponível"
        ? StatusAssets.Available
        : status === "Desabilitado"
        ? StatusAssets.Disabled
        : StatusAssets.Maintenance;

    return statusColorMap[assetStatus];
  }

  const reportTitle: any[] = [
    {
      columns: [
        {
          margin: [14, 25, 0, 8],
          alignment: "left",
          width: 80,
          image:
            "data:image/png;base64,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",
        },
        {
          text: "Relatório de Ativos",
          fontSize: 20,
          bold: true,
          margin: [145, 25],
          alignment: "left",
        },
      ],
    },
  ];

  function createBodyDocument() {
    const header = [
      {
        text: "Id ativo",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Descrição",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Status anterior",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Status atual",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Data ocorrência",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Colaborador",
        style: "header",
        border: [false, false, false, false],
      },
      {
        text: "Registrado por",
        style: "header",
        border: [false, false, false, false],
      },
    ];

    const lineHeader = [
      {
        text: "__________________________________________________________________________________________________________________________________________________________________________________________________________________________________",
        alignment: "left",
        fontSize: 5,
        colSpan: 7,
        border: [false, false, false, false],
      },
      {},
      {},
      {},
      {},
      {},
      {},
    ];

    const body = data.map((data: IAssetsHistoric) => {
      return [
        {
          text: data.asset?.idClient,
          border: [false, false, false, false],
          style: "contentTable",
        },
        {
          text: data.asset?.description,
          border: [false, false, false, false],
          style: "contentTable",
        },
        {
          text: data.previousStatus,
          border: [false, false, false, false],
          style: "contentTable",
          color: changeColor(data.previousStatus as string),
        },
        {
          text: data.status,
          border: [false, false, false, false],
          style: "contentTable",
          color: changeColor(data.status),
        },
        {
          text: data.dateRegister,
          border: [false, false, false, false],
          style: "contentTable",
        },
        {
          text: data.collaborator?.name ? data.collaborator?.name : "-",
          border: [false, false, false, false],
          style: "contentTable",
        },
        {
          text: data.user?.name.split(" ")[0],
          border: [false, false, false, false],
          style: "contentTable",
        },
      ];
    });

    let content = [header, lineHeader];

    return [...content, ...body];
  }

  const details: any[] = [
    {
      table: {
        headerRows: 1,
        widths: [45, "*", 70, 70, "*", "*", 45],
        body: createBodyDocument(),
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex % 2 !== 0 && rowIndex !== 1 ? "#f4f4f5" : null;
        },
      },
    },
  ];

  function footer(currentPage: number, pageCount: number): Content {
    return [
      {
        columns: [
          {
            text: new Date().toLocaleDateString(),
            fontSize: 10,
            alignment: "left",
            margin: [20, 10, 0, 0],
          },
          {
            text: currentPage.toString() + "/" + pageCount.toString(),
            fontSize: 10,
            margin: [0, 10, 20, 0],
            alignment: "right",
          },
        ],
      },
    ];
  }

  const docDefinitions = {
    pageSize: "A4" as PredefinedPageSize,
    pageMargins: [10, 52] as [number, number],

    header: [reportTitle],
    content: [details],
    footer: footer,
    styles: {
      header: {
        bold: true,
        fontSize: 8,
        margin: [0, 55, 0, 0] as [number, number, number, number],
        color: "#525252",
      },
      contentTable: {
        fontSize: 9,
        margin: [5, 8] as [number, number],
      },
    },
  };

  pdfMake.createPdf(docDefinitions).open();
}
