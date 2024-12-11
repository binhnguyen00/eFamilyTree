import React from "react";
import { useNavigate } from "react-router-dom";

import { t } from "i18next";
import { Box, Text } from "zmp-ui";

import { CommonIcon, Header } from "components";
import { SearchBar } from "components/common/SearchBar";

const data = [
  {
    "name": "Quỹ Đám Giỗ",
    "dong_ho": "Phạm Khắc",
    "total_amount": 1850000,
    "income_ids": [
      {
        "id": 6,
        "nguoi_nop": [
          23,
          "Hoàng Thị Hoa"
        ],
        "amount": 5000000,
        "date": "2024-10-29",
        "note": "Đóng tiền quỹ Đám Giỗ"
      },
      {
        "id": 7,
        "nguoi_nop": [
          23,
          "Hoàng Thị Hoa"
        ],
        "amount": 5000000,
        "date": "2024-10-31",
        "note": "Đóng tiền quỹ Đám Giỗ"
      }
    ],
    "expense_ids": [
      {
        "id": 2,
        "amount": 150000,
        "date": "2024-10-31",
        "note": "Mua nhang"
      },
      {
        "id": 3,
        "amount": 200000,
        "date": "2024-10-31",
        "note": "mua tiền vàng"
      },
      {
        "id": 4,
        "amount": 7800000,
        "date": "2024-11-26",
        "note": "xây mộ"
      },
    ]
  },
  {
    "name": "Quỹ Sinh Nhật",
    "dong_ho": "Dòng họ Phạm Khắc",
    "total_amount": 5500000,
    "income_ids": [
      {
        "id": 7,
        "nguoi_nop": [
          1,
          "Phạm Khắc Hoàng"
        ],
        "amount": 3500000,
        "date": "2024-01-01",
        "note": "Đóng tiền quỹ Sinh nhật"
      },
      {
        "id": 8,
        "nguoi_nop": [
          1,
          "Phạm Khắc Hoàng"
        ],
        "amount": 3500000,
        "date": "2024-01-02",
        "note": "Đóng tiền quỹ Sinh nhật"
      }
    ],
    "expense_ids": [
      {
        "id": 2,
        "amount": 500000,
        "date": "2024-05-25",
        "note": "mua quà cho bé Hoa"
      },
      {
        "id": 3,
        "amount": 1000000,
        "date": "2024-05-25",
        "note": "thuê trang trí"
      },
    ]
  }
]

export default function UIDummyFund() {
  const navigate = useNavigate();
  const [funds, setFunds] = React.useState<any[]>(data);

  const navigateToFundDetail = (fund: any = null) => {
    if (!fund) return;
    navigate("/demo-fund-detail", { state: { fund } });
  }

  const renderFunds = () => {
    let html = [] as React.ReactNode[];

    funds.map((item, index) => {
      const totalAmount = Number.parseFloat(item["total_amount"]);
      const formatted = new Intl.NumberFormat('id-ID').format(totalAmount)
      html.push(
        <Box
          onClick={() => navigateToFundDetail(item)}
          flex flexDirection="row" justifyContent="space-between"
          className="bg-secondary text-primary p-3 rounded mt-2"
        >
          <div>
            <Text.Title> {item["name"]} </Text.Title>
            <Text> {formatted} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </Box>
      )
    })

    return (
      <div className="flex-v">
        {html}
      </div>
    )
  }

  return (
    <div className="container">
      <Header title={t("funds")}/>

      <SearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />

      {renderFunds()}
    </div>
  )
}