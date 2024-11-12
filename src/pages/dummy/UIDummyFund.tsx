import React from "react";
import { IoIosArrowForward } from "react-icons/io";

import { t } from "i18next";
import { List, Text, useNavigate } from "zmp-ui";

import UISearchBar from "components/common/UISearchBar";
import UIHeader from "components/common/UIHeader";

const data = [
  {
    "name": "Quỹ Đám Giỗ",
    "dong_ho": "Phạm Khắc",
    "total_amount": 10000000,
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
    "total_amount": 7000000,
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
      html.push(
        <List.Item
          key={index}
          suffix={<IoIosArrowForward size={12}/>}
          onClick={() => navigateToFundDetail(item)}
        >
          <>
            <Text.Title> {item["name"]} </Text.Title>
            <Text> {item["total_amount"]} </Text>
          </>
        </List.Item>
      )
    })

    return (
      <List>
        <>{html}</>
      </List>
    )
  }

  return (
    <div className="container">
      <UIHeader title={t("funds")}/>

      <UISearchBar 
        placeholder={t("search_funds")}
        onSearch={(text, event) => console.log(text)}
      />

      {renderFunds()}
    </div>
  )
}