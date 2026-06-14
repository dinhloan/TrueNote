# Awareness Journal App

Một web app viết nhật ký hằng ngày giúp người dùng **viết ra suy nghĩ**, **dừng lại**, **đối chiếu với thực tế**, **kiểm chứng điều mình đang tin**, **chốt lại nhận thức mới** và **lưu vết hành trình tự hiểu chính mình theo thời gian**.

---

## 1. Định vị sản phẩm

Đây không chỉ là một app ghi chú hay app viết nhật ký để xả cảm xúc.

Sản phẩm này được thiết kế như một hệ thống giúp người dùng nâng cao nhận thức thông qua việc viết.

> Viết ra để thấy rõ.  
> Kiểm chứng để không còn tin mù mờ.  
> Chốt lại để nhận thức được lưu vết.  
> Liên kết lại để hiểu mình sâu hơn.

---

## 2. Lõi sản phẩm

Trọng tâm của app là:

```text
Viết để tự hiểu chính mình.
```

Trong sản phẩm này, **nhận thức** được hiểu là:

```text
Nhận thức = hiểu đúng + trải nghiệm + tin chắc
```

Vì vậy app không chỉ lưu:

```text
Hôm nay mình đã nghĩ gì?
```

Mà giúp người dùng đi tới:

```text
Hôm nay mình đã nhìn ra điều gì?
Suy nghĩ nào của mình không có đủ cơ sở?
Mình đã hiểu đúng hơn điều gì?
```

---

## 3. Tech Stack

### Frontend

- ReactJS
- React Router
- TailwindCSS
- Zustand hoặc Redux Toolkit
- Markdown editor / rich text editor

### Backend

- NodeJS
- ExpressJS
- JWT Authentication
- REST API

### Database

- MongoDB
- Mongoose

---

## 4. Flow chính của sản phẩm

```text
1. Viết tự do
2. Dừng lại
3. Thực tế có gì?
4. Kiểm chứng
5. Chốt nhận thức
6. Lưu dấu vết nhận thức
7. Liên kết vào bản đồ nhận thức
```

Nói ngắn gọn:

```text
Viết
→ Dừng lại
→ Thực tế có gì
→ Kiểm chứng
→ Chốt
→ Lưu vết
→ Nhìn lại bức tranh tổng thể
```

---

## 5. Nguyên tắc thiết kế

### Không chỉ cho viết tự do

Nếu app chỉ cho user viết tự do, user dễ rơi vào trạng thái:

```text
xả cảm xúc
→ lan man
→ lặp lại suy nghĩ cũ
→ không chuyển hóa
```

### Không ép user vào form quá cứng

Nếu app bắt user trả lời quá nhiều câu hỏi hoặc phân loại từng câu, trải nghiệm sẽ giống một bài tập tâm lý, dễ khiến user mệt và bỏ dùng.

### Không dùng AI để phản biện thay user

App không nên nghĩ hộ user.  
App chỉ tạo cấu trúc để user tự kiểm chứng suy nghĩ của chính mình.

Mục tiêu là để user cảm thấy:

```text
Mình đang tự nhìn rõ hơn.
```

Không phải:

```text
App đang sửa mình.
```

---

## 6. Các màn hình chính

App gồm 5 màn hình chính:

```text
1. Màn hình viết hôm nay
2. Màn hình thực tế có gì
3. Màn hình kiểm chứng
4. Màn hình chốt nhận thức
5. Màn hình bản đồ nhận thức
```

---

## 7. Màn hình 1 — Viết hôm nay

### Mục tiêu

Cho user đưa suy nghĩ từ trong đầu ra ngoài.

Ở màn hình này, app không phân tích, không chen vào, không hỏi dồn.

### UI gợi ý

```text
┌──────────────────────────────────────────────────────────────┐
│ Sidebar                    │ Nhật ký hôm nay                  │
│                            │ Thứ Năm, 14/05/2026              │
│ ◉ Hôm nay                  │                                  │
│ ○ Cần nhìn lại             │ Hôm nay trong bạn đang có gì?    │
│ ○ Dấu vết nhận thức        │                                  │
│ ○ Bản đồ nhận thức         │ ┌──────────────────────────────┐ │
│ ○ Chủ đề lặp lại           │ │                              │ │
│                            │ │ User viết tự do ở đây        │ │
│                            │ │                              │ │
│                            │ └──────────────────────────────┘ │
│                            │                                  │
│                            │ Đã tự lưu lúc 21:34             │
│                            │                                  │
│                            │ [ Dừng lại và nhìn rõ hơn ]      │
└──────────────────────────────────────────────────────────────┘
```

### Lưu ý

Không nên có nút `Lưu nháp` nổi bật.

Thay vào đó:

```text
App tự động lưu phần viết thô.
```

Nút chính của màn hình này là:

```text
Dừng lại và nhìn rõ hơn
```

---

## 8. Nhật ký thô

Khi user viết, app tự lưu thành **nhật ký thô**.

Trạng thái:

```text
Chưa làm rõ
```

Ví dụ dữ liệu:

```js
{
  userId: "user_001",
  date: "2026-05-14",
  rawContent: "Hôm nay mình rất mệt...",
  status: "raw",
  hasReflection: false,
  createdAt: "...",
  updatedAt: "..."
}
```

Nhật ký thô không phải output cuối cùng.  
Nó là nguyên liệu ban đầu để đi vào nhận thức.

---

## 9. Màn hình 2 — Thực tế có gì?

### Mục tiêu

Kéo tâm trí user từ câu chuyện trong đầu trở về thực tế.

Không hỏi user phải tích cực.  
Không hỏi user học được gì.  
Chỉ hỏi:

```text
Thực tế có gì?
```

### UI gợi ý

```text
┌──────────────────────────────────────────────────────────────┐
│ Nhật ký ban đầu              │ Thực tế có gì?                 │
│──────────────────────────────│─────────────────────────────── │
│                              │ Bước 2                         │
│ Hôm nay mình rất mệt.        │                                │
│                              │ Trong những điều vừa viết,     │
│ Bạn đó không trả lời tin     │ điều gì thật sự đã xảy ra?     │
│ nhắn. Mình nghĩ chắc họ      │                                │
│ không còn quan tâm mình nữa. │ ┌───────────────────────────┐  │
│                              │ │ -                         │  │
│ Mình thấy mình không quan    │ │ -                         │  │
│ trọng. Có lẽ mình luôn là    │ │ -                         │  │
│ người bị bỏ lại.             │ └───────────────────────────┘  │
│                              │                                │
│                              │ [ Quay lại ] [ Tiếp tục ]      │
└──────────────────────────────────────────────────────────────┘
```

### Ví dụ user nhập

```text
- Họ chưa trả lời tin nhắn trong 5 tiếng.
- Mình đã nhắn lúc 10 giờ sáng.
- Mình chưa hỏi lý do.
- Hôm nay mình ngủ ít.
- Mình đang buồn.
```

### Output

```js
realityFacts: [
  "Họ chưa trả lời tin nhắn trong 5 tiếng",
  "Mình đã nhắn lúc 10 giờ sáng",
  "Mình chưa hỏi lý do",
  "Hôm nay mình ngủ ít",
  "Mình đang buồn"
]
```

---

## 10. Màn hình 3 — Kiểm chứng

Đây là màn hình quan trọng nhất của sản phẩm.

### Mục tiêu

Màn hình này giúp user dùng lý luận để tự thấy:

```text
Điều mình đang tin có thật sự đủ cơ sở không?
```

Kiểm chứng giúp tâm trí được thuyết phục rằng:

```text
Niềm tin này chưa chắc đúng như mình tưởng.
```

### Cấu trúc màn hình

```text
1. Điều mình đang tin
2. Mức độ mình đang tin
3. Cơ sở khiến mình tin như vậy
4. Cơ sở này đã đủ để kết luận chưa?
5. Có khả năng nào khác cũng hợp lý không?
6. Sau khi kiểm chứng, mình thấy gì?
```

### UI gợi ý

```text
┌────────────────────────────────────────────────────────────────────┐
│ Bước 3 — Kiểm chứng                                                │
│ Nhìn lại điều mình đang tin, đối chiếu với thực tế,                 │
│ để xem nó có đủ cơ sở không.                                       │
├───────────────────────────────┬────────────────────────────────────┤
│ THỰC TẾ ĐÃ GHI                │ ĐIỀU MÌNH ĐANG TIN                 │
│                               │                                    │
│ ✓ Họ chưa trả lời 5 tiếng     │ Mình đang tin rằng:                │
│ ✓ Mình đã nhắn lúc 10h        │ ┌──────────────────────────────┐   │
│ ✓ Mình chưa hỏi lý do         │ │ Họ không còn quan tâm mình.  │   │
│ ✓ Hôm nay mình ngủ ít         │ └──────────────────────────────┘   │
│ ✓ Mình đang buồn              │                                    │
│                               │ Mức độ mình đang tin:              │
│                               │ ○ 1  ○ 2  ○ 3  ● 4  ○ 5           │
│                               │                                    │
│                               │ Cơ sở nào khiến mình tin vậy?      │
│                               │ ┌──────────────────────────────┐   │
│                               │ │ Họ chưa trả lời tin nhắn.    │   │
│                               │ └──────────────────────────────┘   │
│                               │                                    │
│                               │ Cơ sở này đã đủ để kết luận chưa? │
│                               │ ○ Đủ  ● Chưa đủ  ○ Chưa chắc       │
│                               │                                    │
│                               │ Có khả năng nào khác cũng hợp lý?  │
│                               │ ┌──────────────────────────────┐   │
│                               │ │ Có thể họ đang bận.          │   │
│                               │ │ Có thể họ chưa thấy tin.     │   │
│                               │ │ Có thể họ đang mệt.          │   │
│                               │ └──────────────────────────────┘   │
│                               │                                    │
│                               │ Sau khi kiểm chứng, mình thấy:     │
│                               │ ┌──────────────────────────────┐   │
│                               │ │ Mình chưa đủ cơ sở để kết    │   │
│                               │ │ luận họ không quan tâm mình. │   │
│                               │ └──────────────────────────────┘   │
│                               │                                    │
│                               │ Mức độ mình còn tin điều này:      │
│                               │ ○ 1  ● 2  ○ 3  ○ 4  ○ 5           │
│                               │                                    │
│                               │ [ Quay lại ]        [ Tiếp tục ]   │
└───────────────────────────────┴────────────────────────────────────┘
```

### Nếu có nhiều niềm tin

Không nên bắt user kiểm chứng tất cả cùng lúc.

App nên hỏi:

```text
Điều nào đang làm bạn nặng nhất lúc này?
```

Ví dụ:

```text
○ Họ không quan tâm mình
○ Mình không quan trọng
○ Mình luôn bị bỏ lại

[ Bắt đầu kiểm chứng ]
```

---

## 11. Output của màn hình Kiểm chứng

Màn hình này phải tạo ra một lập luận hoàn chỉnh.

```js
{
  beliefBeingChecked: "Họ không còn quan tâm mình",
  beliefLevelBefore: 4,

  supportingBasis: [
    "Họ chưa trả lời tin nhắn trong 5 tiếng"
  ],

  isBasisEnough: "not_enough",

  alternativePossibilities: [
    "Họ có thể đang bận",
    "Họ có thể chưa thấy tin",
    "Họ có thể đang mệt"
  ],

  reasoningConclusion: "Mình chưa đủ cơ sở để kết luận rằng họ không còn quan tâm mình",

  beliefLevelAfter: 2
}
```

Đây là dữ liệu chứng minh user không chỉ viết cho nhẹ lòng, mà đã đi qua quá trình kiểm chứng bằng lý luận.

---

## 12. Màn hình 4 — Chốt nhận thức

### Mục tiêu

Sau khi kiểm chứng, user không chỉ dừng ở:

```text
Niềm tin này chưa đủ cơ sở.
```

Mà đi tiếp tới:

```text
Mình nhận ra gì về cách mình suy nghĩ?
```

Đây là nơi tạo **dấu vết nhận thức**.

### UI gợi ý

```text
┌────────────────────────────────────────────────────────────────────┐
│ Bước 4 — Chốt nhận thức                                            │
├───────────────────────────────┬────────────────────────────────────┤
│ KẾT QUẢ KIỂM CHỨNG            │ NHẬN THỨC HÔM NAY                  │
│                               │                                    │
│ Điều mình đã tin:             │ Khi điều mình đang tin không còn  │
│ “Họ không còn quan tâm mình.” │ chắc như trước,                   │
│                               │ mình thấy gì rõ hơn?              │
│ Cơ sở hiện có:                │                                    │
│ “Họ chưa trả lời 5 tiếng.”    │ ┌──────────────────────────────┐   │
│                               │ │ Mình nhận ra mình hay biến    │   │
│ Kết quả kiểm chứng:           │ │ sự im lặng của người khác    │   │
│ “Chưa đủ cơ sở để kết luận.”  │ │ thành bằng chứng rằng mình   │   │
│                               │ │ không quan trọng.             │   │
│ Mức độ tin: 4/5 → 2/5         │ └──────────────────────────────┘   │
│                               │                                    │
│                               │ Điều mình muốn ghi nhớ:            │
│                               │ ┌──────────────────────────────┐   │
│                               │ │ Sự im lặng không đồng nghĩa   │   │
│                               │ │ với sự từ chối.               │   │
│                               │ └──────────────────────────────┘   │
│                               │                                    │
│                               │ Mức độ mình thật sự thấy:          │
│                               │ ○ 1  ○ 2  ○ 3  ● 4  ○ 5           │
│                               │                                    │
│                               │ [ Lưu dấu vết nhận thức ]          │
└───────────────────────────────┴────────────────────────────────────┘
```

---

## 13. Phân biệt Kiểm chứng và Chốt nhận thức

### Kiểm chứng trả lời:

```text
Niềm tin cũ có đủ cơ sở không?
```

Ví dụ:

```text
Mình chưa đủ cơ sở để kết luận họ không quan tâm mình.
```

### Chốt nhận thức trả lời:

```text
Sau khi thấy niềm tin cũ không đủ cơ sở,
mình nhận ra gì về cách mình suy nghĩ?
```

Ví dụ:

```text
Mình nhận ra mình hay biến sự im lặng thành bằng chứng rằng mình không quan trọng.
```

---

## 14. Dấu vết nhận thức

Khi user bấm **Lưu dấu vết nhận thức**, app tạo một bản ghi riêng.

Đây là output chính của sản phẩm.

Một dấu vết nhận thức gồm:

```text
1. Nhật ký gốc
2. Thực tế đã ghi
3. Điều đã kiểm chứng
4. Kết quả kiểm chứng
5. Nhận thức đã chốt
6. Điều muốn ghi nhớ
7. Chủ đề liên kết
```

### UI gợi ý

```text
┌──────────────────────────────────────────────────────────────┐
│ Dấu vết nhận thức                                            │
│ 14/05/2026                                                   │
│──────────────────────────────────────────────────────────────│
│                                                              │
│ Nhật ký gốc                                                  │
│ “Bạn đó không trả lời tin nhắn.                              │
│ Mình nghĩ chắc họ không còn quan tâm mình nữa.”              │
│                                                              │
│ Thực tế đã ghi                                               │
│ - Họ chưa trả lời tin nhắn trong 5 tiếng                     │
│ - Mình chưa hỏi lý do                                        │
│ - Hôm nay mình ngủ ít                                        │
│                                                              │
│ Điều đã kiểm chứng                                           │
│ “Họ không còn quan tâm mình.”                                │
│                                                              │
│ Cơ sở hiện có                                                │
│ “Họ chưa trả lời tin nhắn trong 5 tiếng.”                    │
│                                                              │
│ Kết quả kiểm chứng                                           │
│ “Chưa đủ cơ sở để kết luận điều đó.”                         │
│                                                              │
│ Mức độ tin                                                   │
│ 4/5 → 2/5                                                    │
│                                                              │
│ Nhận thức hôm nay                                            │
│ “Mình nhận ra mình hay biến sự im lặng của người khác        │
│ thành bằng chứng rằng mình không quan trọng.”                │
│                                                              │
│ Điều muốn ghi nhớ                                            │
│ “Sự im lặng không đồng nghĩa với sự từ chối.”                 │
│                                                              │
│ Chủ đề                                                       │
│ #sợ_bị_bỏ_rơi #giá_trị_bản_thân #diễn_giải                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 15. Màn hình 5 — Bản đồ nhận thức

### Mục tiêu

Sau nhiều ngày, app giúp user nhìn ra:

```text
Mình đang lặp lại niềm tin nào?
Mình đã kiểm chứng điều gì nhiều lần?
Nhận thức nào đang dần hình thành?
```

### UI tổng quan

```text
┌──────────────────────────────────────────────────────────────┐
│ Bản đồ nhận thức                                             │
│──────────────────────────────────────────────────────────────│
│                                                              │
│ Chủ đề lặp lại nhiều nhất                                    │
│                                                              │
│ #sợ_bị_bỏ_rơi                         9 dấu vết             │
│ █████████                                                    │
│                                                              │
│ #giá_trị_bản_thân                     7 dấu vết              │
│ ███████                                                      │
│                                                              │
│ #sợ_bị_đánh_giá                      4 dấu vết               │
│ ████                                                         │
│                                                              │
│──────────────────────────────────────────────────────────────│
│                                                              │
│ Hành trình của chủ đề: #sợ_bị_bỏ_rơi                         │
│                                                              │
│ 03/05                                                        │
│ “Mình sợ khi người khác không phản hồi.”                     │
│                                                              │
│ 10/05                                                        │
│ “Mình nhận ra mình lấy sự im lặng làm dấu hiệu bị từ chối.”  │
│                                                              │
│ 14/05                                                        │
│ “Sự im lặng không đủ để kết luận rằng mình không quan trọng.”│
│                                                              │
│ 22/05                                                        │
│ “Mình bắt đầu biết tự trấn an trước khi tìm xác nhận ngoài.” │
└──────────────────────────────────────────────────────────────┘
```

---

## 16. Chi tiết một chủ đề

Khi user bấm vào một chủ đề, ví dụ `#sợ_bị_bỏ_rơi`, app mở màn hình chi tiết:

```text
┌──────────────────────────────────────────────────────────────┐
│ Chủ đề: Sợ bị bỏ rơi                                        │
│──────────────────────────────────────────────────────────────│
│                                                              │
│ Xuất hiện: 9 lần trong 30 ngày                              │
│ Gần nhất: 14/05/2026                                        │
│                                                              │
│ Những điều thường được kiểm chứng:                           │
│ - Họ không quan tâm mình                                    │
│ - Mình không quan trọng                                     │
│ - Mình luôn là người bị bỏ lại                              │
│                                                              │
│ Các cơ sở thường khiến mình tin như vậy:                     │
│ - Người khác trả lời chậm                                   │
│ - Một cuộc trò chuyện ngắn hơn bình thường                  │
│ - Không được chú ý ngay lập tức                             │
│                                                              │
│ Kết quả kiểm chứng thường gặp:                              │
│ - Chưa đủ cơ sở để kết luận bị bỏ rơi                       │
│ - Phản hồi chậm không đồng nghĩa với hết quan tâm           │
│ - Khi mình mệt, mình dễ diễn giải tiêu cực hơn              │
│                                                              │
│ Nhận thức đã hình thành:                                    │
│ - Sự im lặng không đồng nghĩa với từ chối                   │
│ - Mình có xu hướng lấy phản hồi bên ngoài làm thước đo      │
│ - Mình cần học cách tự trấn an trước khi tìm xác nhận ngoài │
└──────────────────────────────────────────────────────────────┘
```

---

## 17. Trạng thái của một nhật ký

Mỗi bài viết có thể có 4 trạng thái:

```text
1. Đang viết
2. Chưa làm rõ
3. Đang kiểm chứng
4. Đã chốt nhận thức
```

Trên lịch có thể hiển thị:

```text
○ Chỉ viết thô
◐ Đang làm rõ / kiểm chứng
● Đã chốt nhận thức
```

Ví dụ:

```text
┌──────────────────────────────┐
│ Tháng 5/2026                 │
│                              │
│ 12  ○                        │
│ 13  ◐                        │
│ 14  ●                        │
│                              │
│ ○ Chỉ viết                   │
│ ◐ Đang kiểm chứng            │
│ ● Đã chốt nhận thức          │
└──────────────────────────────┘
```

---

## 18. Khu vực Cần nhìn lại

Vì không nên ép user ngày nào cũng phải chốt, app cần khu vực:

```text
Cần nhìn lại
```

Nơi này chứa các nhật ký đã viết nhưng chưa đi qua kiểm chứng.

### UI gợi ý

```text
┌──────────────────────────────────────────────┐
│ Cần nhìn lại                                 │
│                                              │
│ 14/05/2026                                   │
│ “Hôm nay mình rất mệt...”                    │
│ Trạng thái: Chưa làm rõ                      │
│ [ Tiếp tục nhìn rõ ]                         │
│                                              │
│ 10/05/2026                                   │
│ “Mình thấy khó chịu khi...”                  │
│ Trạng thái: Đang kiểm chứng                  │
│ [ Tiếp tục kiểm chứng ]                      │
└──────────────────────────────────────────────┘
```

Ngôn ngữ nên mềm:

```text
Có vài điều cũ vẫn đang chờ được nhìn rõ.
```

Không nên viết:

```text
Bạn chưa hoàn thành.
```

---

## 19. Cấu trúc dữ liệu MongoDB

### Collection: DailyEntry

Lưu nhật ký thô.

```js
{
  _id,
  userId,
  date,
  rawContent,
  status: "writing" | "raw" | "checking" | "completed",
  createdAt,
  updatedAt
}
```

### Collection: RealityCheck

Lưu phần “Thực tế có gì”.

```js
{
  _id,
  userId,
  dailyEntryId,
  facts: [
    "Họ chưa trả lời tin nhắn trong 5 tiếng",
    "Mình chưa hỏi lý do",
    "Hôm nay mình ngủ ít"
  ],
  createdAt,
  updatedAt
}
```

### Collection: Verification

Lưu phần kiểm chứng.

```js
{
  _id,
  userId,
  dailyEntryId,

  beliefBeingChecked: "Họ không còn quan tâm mình",
  beliefLevelBefore: 4,

  supportingBasis: [
    "Họ chưa trả lời tin nhắn trong 5 tiếng"
  ],

  isBasisEnough: "not_enough",

  alternativePossibilities: [
    "Họ có thể đang bận",
    "Họ có thể chưa thấy tin",
    "Họ có thể đang mệt"
  ],

  reasoningConclusion: "Mình chưa đủ cơ sở để kết luận rằng họ không còn quan tâm mình",

  beliefLevelAfter: 2,

  createdAt,
  updatedAt
}
```

### Collection: AwarenessTrace

Lưu dấu vết nhận thức.

```js
{
  _id,
  userId,
  dailyEntryId,
  verificationId,

  awarenessStatement: "Mình nhận ra mình hay biến sự im lặng thành bằng chứng rằng mình không quan trọng.",

  reminderStatement: "Sự im lặng không đồng nghĩa với sự từ chối.",

  certaintyLevel: 4,

  themes: [
    "sợ bị bỏ rơi",
    "giá trị bản thân",
    "diễn giải"
  ],

  createdAt,
  updatedAt
}
```

### Collection: Theme

Lưu chủ đề lặp lại.

```js
{
  _id,
  userId,
  name: "sợ bị bỏ rơi",
  traceCount: 9,
  relatedThemes: [
    "giá trị bản thân",
    "cần được công nhận"
  ],
  createdAt,
  updatedAt
}
```

---

## 20. API chính

### Daily Entry

```http
GET    /api/daily/today
GET    /api/daily/:date
POST   /api/daily
PUT    /api/daily/:id
```

### Reality Check

```http
POST   /api/daily/:id/reality
GET    /api/daily/:id/reality
PUT    /api/reality/:id
```

### Verification

```http
POST   /api/daily/:id/verification
GET    /api/daily/:id/verification
PUT    /api/verification/:id
```

### Awareness Trace

```http
POST   /api/daily/:id/awareness-trace
GET    /api/awareness-traces
GET    /api/awareness-traces/:id
```

### Awareness Map

```http
GET    /api/awareness-map
GET    /api/themes
GET    /api/themes/:themeId
```

---

## 21. Module frontend đề xuất

```text
DailyWritingPage
RealityCheckPage
VerificationPage
AwarenessClosePage
AwarenessTracePage
AwarenessMapPage
ThemeDetailPage
```

---

## 22. MVP Scope

MVP nên tập trung vào 6 phần:

```text
1. Đăng nhập / đăng ký
2. Viết nhật ký hằng ngày
3. Tự động lưu nhật ký thô
4. Thực tế có gì?
5. Kiểm chứng
6. Chốt và lưu dấu vết nhận thức
```

Sau đó mới phát triển:

```text
7. Bản đồ nhận thức
8. Chủ đề lặp lại
9. Timeline nhận thức
10. Graph liên kết kiểu Obsidian
```

---

## 23. Output cần đảm bảo

Sản phẩm chỉ được xem là hoàn thành đúng mục tiêu nếu tạo được:

```text
Dấu vết nhận thức
```

Một dấu vết nhận thức đạt chuẩn phải có:

```text
1. Nhật ký gốc
2. Thực tế đã ghi
3. Điều đã kiểm chứng
4. Cơ sở khiến user tin điều đó
5. Kết quả kiểm chứng
6. Mức độ tin trước/sau
7. Nhận thức đã chốt
8. Điều muốn ghi nhớ
9. Chủ đề liên kết
```

Nếu thiếu phần kiểm chứng, output sẽ yếu.  
Nếu thiếu phần chốt, app chỉ dừng ở phản biện lý trí.  
Nếu thiếu bản đồ, user sẽ không thấy bức tranh tổng thể theo thời gian.

---

## 24. Ngôn ngữ UI nên dùng

Nên dùng:

```text
Hôm nay trong bạn đang có gì?
Dừng lại và nhìn rõ hơn
Thực tế có gì?
Điều mình đang tin
Cơ sở nào khiến mình tin vậy?
Cơ sở này đã đủ để kết luận chưa?
Có khả năng nào khác cũng hợp lý không?
Sau khi kiểm chứng, mình thấy gì?
Khi điều mình tin không còn chắc như trước, mình nhận ra gì?
Điều mình muốn ghi nhớ
Lưu dấu vết nhận thức
```

Không nên dùng:

```text
Niềm tin sai lệch
Phân tích lỗi tư duy
Chứng minh bạn sai
Bằng chứng phản bác
Hoàn thành bài tập
Chữa lành hôm nay
```

---

## 25. Kết luận

Bản thiết kế sau cùng có trục rất rõ:

```text
Viết tự do
```

để suy nghĩ được đưa ra ngoài.

```text
Thực tế có gì
```

để tâm trí chạm lại nền đất.

```text
Kiểm chứng
```

để lý luận đủ thuyết phục rằng niềm tin cũ chưa có đủ cơ sở.

```text
Chốt nhận thức
```

để điều đã thấy không trôi mất trong đầu.

```text
Lưu dấu vết nhận thức
```

để tạo dấu ấn tâm thức.

```text
Bản đồ nhận thức
```

để liên kết nhiều dấu vết thành bức tranh tổng thể về chính mình.

Đây là điểm khác biệt cốt lõi của sản phẩm:

> App không chỉ giúp người dùng viết nhật ký.  
> App giúp người dùng nhìn thấy suy nghĩ nào không có cơ sở, kiểm chứng nó, chốt lại nhận thức mới và theo dõi hành trình tự hiểu chính mình theo thời gian.
