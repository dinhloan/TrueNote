# Awareness Journal App — MongoDB Atlas Backend

Backend mẫu cho app viết nhật ký nâng cao nhận thức, dùng:

- Node.js
- Express.js
- JWT Authentication
- MongoDB Atlas
- Mongoose

Thiết kế này đi theo luồng sản phẩm:

```text
Viết tự do
→ Thực tế có gì
→ Kiểm chứng
→ Chốt nhận thức
→ Lưu dấu vết nhận thức
→ Bản đồ nhận thức
```

---

## 1. Tư duy thiết kế database

### Nguyên tắc chính

Không gom tất cả vào một document quá lớn.

App có 5 bước nhận thức khác nhau, nên database cũng tách thành các collection khác nhau:

```text
User
DailyEntry
RealityCheck
Verification
AwarenessTrace
Theme
```

Lý do:

- `DailyEntry` là nguyên liệu thô.
- `RealityCheck` là phần kéo user về thực tế.
- `Verification` là phần kiểm chứng bằng lý luận.
- `AwarenessTrace` là output cuối cùng.
- `Theme` là lớp tổng hợp để tạo bản đồ nhận thức.

Điểm quan trọng nhất: `AwarenessTrace` có thêm `snapshot`.

Điều này giúp dấu vết nhận thức không bị méo khi user sửa nhật ký gốc hoặc sửa phần kiểm chứng sau này.

---

## 2. Sơ đồ quan hệ dữ liệu

```text
User 1 ──── n DailyEntry
User 1 ──── n RealityCheck
User 1 ──── n Verification
User 1 ──── n AwarenessTrace
User 1 ──── n Theme

DailyEntry 1 ──── 0..1 RealityCheck
DailyEntry 1 ──── 0..n Verification
Verification 1 ──── 0..1 AwarenessTrace
AwarenessTrace n ──── n Theme, qua themeSlugs
```

---

## 3. Collections

### 3.1 User

Lưu thông tin đăng nhập.

```js
{
  _id,
  displayName,
  email,
  passwordHash,
  role: "user" | "admin",
  isActive,
  lastLoginAt,
  createdAt,
  updatedAt
}
```

Index:

```js
{ email: 1 }, unique
```

---

### 3.2 DailyEntry

Lưu phần viết thô của mỗi ngày.

```js
{
  _id,
  userId,
  localDate: "2026-05-14",
  rawContent: "Hôm nay trong mình đang có...",
  status: "writing" | "raw" | "checking" | "completed",
  hasReality,
  hasVerification,
  hasTrace,
  wordCount,
  lastAutosavedAt,
  createdAt,
  updatedAt
}
```

Index:

```js
{ userId: 1, localDate: 1 }, unique
{ userId: 1, status: 1, updatedAt: -1 }
{ userId: 1, createdAt: -1 }
```

Vì mỗi user chỉ nên có một nhật ký cho một ngày, `userId + localDate` phải unique.

---

### 3.3 RealityCheck

Lưu phần “Thực tế có gì?”.

```js
{
  _id,
  userId,
  dailyEntryId,
  facts: [
    { text: "Họ chưa trả lời tin nhắn trong 5 tiếng", order: 0 },
    { text: "Mình chưa hỏi lý do", order: 1 }
  ],
  createdAt,
  updatedAt
}
```

Index:

```js
{ userId: 1, dailyEntryId: 1 }, unique
```

MVP chỉ cần một RealityCheck cho một DailyEntry.

---

### 3.4 Verification

Lưu phần kiểm chứng niềm tin.

```js
{
  _id,
  userId,
  dailyEntryId,
  realityCheckId,

  beliefBeingChecked: "Họ không còn quan tâm mình",
  beliefLevelBefore: 4,
  supportingBasis: [
    "Họ chưa trả lời tin nhắn trong 5 tiếng"
  ],
  isBasisEnough: "enough" | "not_enough" | "uncertain",
  alternativePossibilities: [
    "Có thể họ đang bận",
    "Có thể họ chưa thấy tin"
  ],
  reasoningConclusion: "Mình chưa đủ cơ sở để kết luận...",
  beliefLevelAfter: 2,

  createdAt,
  updatedAt
}
```

Index:

```js
{ userId: 1, dailyEntryId: 1, createdAt: -1 }
text index: beliefBeingChecked, reasoningConclusion
```

Thiết kế này cho phép một nhật ký có nhiều lần kiểm chứng nếu sau này app muốn mở rộng.

---

### 3.5 AwarenessTrace

Đây là output quan trọng nhất của sản phẩm.

```js
{
  _id,
  userId,
  dailyEntryId,
  verificationId,

  awarenessStatement: "Mình nhận ra mình hay biến sự im lặng...",
  reminderStatement: "Sự im lặng không đồng nghĩa với sự từ chối.",
  certaintyLevel: 4,

  themes: ["sợ bị bỏ rơi", "giá trị bản thân"],
  themeSlugs: ["so-bi-bo-roi", "gia-tri-ban-than"],

  snapshot: {
    rawContent: "Nhật ký gốc tại thời điểm chốt",
    realityFacts: ["..."],
    verification: {
      beliefBeingChecked,
      beliefLevelBefore,
      supportingBasis,
      isBasisEnough,
      alternativePossibilities,
      reasoningConclusion,
      beliefLevelAfter
    }
  },

  createdAt,
  updatedAt
}
```

Index:

```js
{ userId: 1, verificationId: 1 }, unique
{ userId: 1, createdAt: -1 }
{ userId: 1, themeSlugs: 1, createdAt: -1 }
text index: awarenessStatement, reminderStatement, themes
```

`verificationId` unique để tránh một lần kiểm chứng bị chốt thành nhiều dấu vết trùng nhau.

---

### 3.6 Theme

Lưu chủ đề lặp lại để xây bản đồ nhận thức.

```js
{
  _id,
  userId,
  name: "sợ bị bỏ rơi",
  slug: "so-bi-bo-roi",
  traceCount: 9,
  relatedThemeSlugs: ["gia-tri-ban-than"],
  lastSeenAt,
  commonBeliefs: [],
  commonBasis: [],
  commonConclusions: [],
  createdAt,
  updatedAt
}
```

Index:

```js
{ userId: 1, slug: 1 }, unique
{ userId: 1, traceCount: -1 }
{ userId: 1, lastSeenAt: -1 }
```

---

## 4. Cài MongoDB Atlas

### Bước 1: Tạo Cluster

1. Vào MongoDB Atlas.
2. Tạo Project mới.
3. Tạo Cluster mới, có thể chọn Free / M0 để test.
4. Chọn cloud provider và region gần bạn.

### Bước 2: Tạo Database User

1. Vào `Database Access`.
2. Chọn `Add New Database User`.
3. Tạo username và password.
4. Ghi lại password vì lát nữa sẽ đưa vào connection string.

### Bước 3: Mở Network Access

1. Vào `Network Access`.
2. Chọn `Add IP Address`.
3. Khi test local có thể chọn `Allow Access from Anywhere`.
4. Khi deploy thật, nên giới hạn IP server thay vì mở toàn bộ.

### Bước 4: Lấy Connection String

1. Vào `Database`.
2. Chọn Cluster.
3. Chọn `Connect`.
4. Chọn `Drivers`.
5. Copy URI dạng:

```bash
mongodb+srv://<db_user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Sửa thành:

```bash
mongodb+srv://<db_user>:<password>@cluster0.xxxxx.mongodb.net/awareness_journal?retryWrites=true&w=majority
```

Lưu ý:

- Thay `<db_user>` bằng username Atlas.
- Thay `<password>` bằng password Atlas.
- Thêm tên database `awareness_journal` sau host.
- Nếu password có ký tự đặc biệt như `@`, `#`, `/`, `%`, cần encode password.

---

## 5. Cài backend

### Bước 1: Cài Node.js

Kiểm tra máy đã có Node:

```bash
node -v
npm -v
```

Nên dùng Node.js bản LTS.

### Bước 2: Cài thư viện

```bash
npm install
```

### Bước 3: Tạo file `.env`

Copy file mẫu:

```bash
cp .env.example .env
```

Nếu dùng Windows PowerShell:

```powershell
copy .env.example .env
```

Mở `.env` và thay:

```env
MONGODB_URI=mongodb+srv://<db_user>:<password>@cluster0.xxxxx.mongodb.net/awareness_journal?retryWrites=true&w=majority
JWT_SECRET=mot_chuoi_bao_mat_that_dai
```

### Bước 4: Tạo indexes trên Atlas

```bash
npm run db:indexes
```

Nếu thành công sẽ thấy:

```text
✅ indexes synced: User
✅ indexes synced: DailyEntry
✅ indexes synced: RealityCheck
✅ indexes synced: Verification
✅ indexes synced: AwarenessTrace
✅ indexes synced: Theme
🎉 all indexes created
```

### Bước 5: Seed dữ liệu test

```bash
npm run db:seed
```

Tài khoản test:

```text
email: demo@awareness.local
password: password123
```

### Bước 6: Chạy server

```bash
npm run dev
```

Server mặc định chạy tại:

```text
http://localhost:5000
```

Test nhanh:

```bash
curl http://localhost:5000/health
```

Kết quả:

```json
{
  "ok": true,
  "service": "awareness-journal-api"
}
```

---

## 6. Test API bằng curl

### 6.1 Đăng ký user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Loan",
    "email": "loan@example.com",
    "password": "password123"
  }'
```

Copy `token` trong response.

Trong các lệnh dưới, thay:

```text
<TOKEN>
```

bằng token vừa nhận.

---

### 6.2 Tạo / autosave nhật ký ngày

```bash
curl -X POST http://localhost:5000/api/daily \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "localDate": "2026-05-14",
    "rawContent": "Hôm nay mình rất mệt. Bạn đó không trả lời tin nhắn.",
    "status": "raw"
  }'
```

Copy `_id` của `entry` để dùng cho bước sau.

---

### 6.3 Lưu “Thực tế có gì?”

```bash
curl -X POST http://localhost:5000/api/daily/<ENTRY_ID>/reality \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "facts": [
      "Họ chưa trả lời tin nhắn trong 5 tiếng",
      "Mình chưa hỏi lý do",
      "Hôm nay mình ngủ ít"
    ]
  }'
```

---

### 6.4 Tạo kiểm chứng

```bash
curl -X POST http://localhost:5000/api/daily/<ENTRY_ID>/verification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "beliefBeingChecked": "Họ không còn quan tâm mình",
    "beliefLevelBefore": 4,
    "supportingBasis": ["Họ chưa trả lời tin nhắn trong 5 tiếng"],
    "isBasisEnough": "not_enough",
    "alternativePossibilities": [
      "Có thể họ đang bận",
      "Có thể họ chưa thấy tin",
      "Có thể họ đang mệt"
    ],
    "reasoningConclusion": "Mình chưa đủ cơ sở để kết luận rằng họ không còn quan tâm mình",
    "beliefLevelAfter": 2
  }'
```

Copy `_id` của `verification`.

---

### 6.5 Chốt và lưu dấu vết nhận thức

```bash
curl -X POST http://localhost:5000/api/daily/<ENTRY_ID>/awareness-trace \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "verificationId": "<VERIFICATION_ID>",
    "awarenessStatement": "Mình nhận ra mình hay biến sự im lặng của người khác thành bằng chứng rằng mình không quan trọng.",
    "reminderStatement": "Sự im lặng không đồng nghĩa với sự từ chối.",
    "certaintyLevel": 4,
    "themes": ["sợ bị bỏ rơi", "giá trị bản thân", "diễn giải"]
  }'
```

---

### 6.6 Xem bản đồ nhận thức

```bash
curl http://localhost:5000/api/awareness-map \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 7. API map

```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/daily/today?date=YYYY-MM-DD
GET    /api/daily/:date
POST   /api/daily
PUT    /api/daily/:id

POST   /api/daily/:id/reality
GET    /api/daily/:id/reality
PUT    /api/reality/:id

POST   /api/daily/:id/verification
GET    /api/daily/:id/verification
PUT    /api/verification/:id

POST   /api/daily/:id/awareness-trace

GET    /api/awareness-traces
GET    /api/awareness-traces/:id
GET    /api/awareness-map
GET    /api/themes
GET    /api/themes/:themeId
```

---

## 8. Khi mở MongoDB Atlas sẽ thấy gì?

Sau khi chạy seed hoặc test API, trong Atlas sẽ có database:

```text
awareness_journal
```

Bên trong có các collections:

```text
users
DailyEntry -> dailyentries
RealityCheck -> realitychecks
Verification -> verifications
AwarenessTrace -> awarenesstraces
Theme -> themes
```

Mongoose tự chuyển tên model thành collection dạng số nhiều, chữ thường.

---

## 9. Lỗi thường gặp

### Lỗi 1: Không connect được Atlas

Kiểm tra:

- Đã copy đúng `MONGODB_URI` chưa?
- Đã thay `<password>` chưa?
- Password có ký tự đặc biệt đã encode chưa?
- IP máy đã được mở trong `Network Access` chưa?
- Tên database đã thêm vào URI chưa?

### Lỗi 2: Authentication failed

Nguyên nhân thường gặp:

- Sai database username.
- Sai password.
- Copy password thiếu ký tự.
- Password chứa ký tự đặc biệt nhưng chưa encode.

### Lỗi 3: E11000 duplicate key

Nghĩa là bị trùng unique index.

Ví dụ:

- Một user tạo 2 DailyEntry cùng `localDate`.
- Một verification bị chốt thành 2 AwarenessTrace.
- Một theme slug bị tạo trùng.

Đây không phải lỗi xấu. Đây là database đang bảo vệ dữ liệu không bị trùng.

---

## 10. Hướng phát triển tiếp

Sau MVP, có thể thêm:

1. Timeline nhận thức.
2. Graph liên kết theme kiểu Obsidian.
3. Search theo niềm tin lặp lại.
4. Calendar status: chỉ viết thô / đang kiểm chứng / đã chốt.
5. Reminder quay lại các entry chưa chốt.
6. Export dữ liệu cá nhân dạng Markdown.
