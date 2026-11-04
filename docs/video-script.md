# ITAC 2026 — Jam.dev Screen Recording Script

- Status: DRAFT — recording not yet completed
- Target duration: ~2.5 minutes
- Recording method: Jam.dev screen capture + spoken Hebrew
- Evidence reviewed: `README.md`, `AUDIT.md`, `docs/STP.md`, `docs/STR.md`, `docs/defects.md`, `docs/competition-changes.md`, `tests/fixtures.ts`, `tests/api-mcp.spec.ts`, the public report page, Actions run 41882997402

## Recording preparation

Open these tabs in this order, all on GitHub or the public page, not in the local editor:

1. https://stonewake.ai
2. https://github.com/alessiospb/stonewake-final-repo/blob/master/AUDIT.md
3. https://github.com/alessiospb/stonewake-final-repo/blob/master/tests/fixtures.ts
4. https://github.com/alessiospb/stonewake-final-repo/blob/master/tests/api-mcp.spec.ts
5. https://github.com/alessiospb/stonewake-final-repo/actions/runs/41882997402
6. https://alessiospb.github.io/stonewake-final-repo/
7. https://github.com/alessiospb/stonewake-final-repo/blob/master/docs/STR.md
8. https://github.com/alessiospb/stonewake-final-repo

**Privacy checks**
- Do not open the `baseline` branch, the first commit or the local `.env`: they hold real credentials.
- Do not show the Stonewake dashboard signed in, the password, API key or GitHub Secrets values.
- Turn off notifications and close other tabs.

## Shot list and narration

| Time | Screen / exact navigation | What to point at | Hebrew narration | Russian translation | Evidence |
|---|---|---|---|---|---|
| 0:00–0:20 | Tab 1, stonewake.ai | The home page | שלום, קוראים לי אלכסיי. זה הפרויקט שלי בגמר ITAC. המוצר הוא Stonewake, פלטפורמה למידע עסקי ופיננסי. קיבלנו פרויקט בדיקות קיים, והמשימה הייתה להפוך אותו לאמין. | Здравствуйте, меня зовут Алексей. Это мой проект в финале ITAC. Продукт — Stonewake, платформа деловой и финансовой информации. Мы получили готовый проект тестов, задача была сделать его надёжным. | Organizer email, `README.md` |
| 0:20–0:45 | Tab 2, `AUDIT.md`, section A and B | 10 failed of 20; the credentials risk | התחלתי מאודיט. מתוך עשרים בדיקות, עשר נכשלו. הסיבות היו בעיקר בבדיקות עצמן: כתובות ושדות לא נכונים, וסלקטורים ישנים. בנוסף, סיסמה ומפתח API היו בקוד. | Я начал с аудита. Из двадцати тестов десять падали. Причины были в основном в самих тестах: неверные адреса и поля, устаревшие селекторы. Кроме того, пароль и API-ключ лежали в коде. | `AUDIT.md`, section B |
| 0:45–1:10 | Tab 3, `tests/fixtures.ts` | The `app` fixture | הוצאתי את הסודות מהקוד, ועכשיו הם ב-GitHub Secrets. במקום שמונה עותקים של התחברות, יש fixture אחד ו-Page Objects קטנים. השתמשתי ב-Claude Code, וזה מתועד ב-README. | Я убрал секреты из кода, теперь они в GitHub Secrets. Вместо восьми копий входа есть одна fixture и небольшие Page Objects. Я использовал Claude Code, это описано в README. | `docs/competition-changes.md`, C-01, C-06 |
| 1:10–1:30 | Tab 4, `tests/api-mcp.spec.ts` | The test `portfolio matches the API` | הוספתי כיסוי. עכשיו יש שמונים ושתיים בדיקות: UI, API ושרת MCP. למשל, הבדיקה הזאת משווה את הנתונים מ-MCP לנתונים מה-API. | Я добавил покрытие. Теперь есть восемьдесят два теста: UI, API и сервер MCP. Например, этот тест сравнивает данные из MCP с данными из API. | `docs/STR.md`, sections 2, 3 |
| 1:30–2:00 | Tab 5, the Actions run, then Tab 6, the public page | `80 passed`, `2 skipped` in the log; "5 of 5 runs green"; open one report | זו ריצה ב-GitHub Actions. עשיתי חמש ריצות רצופות על אותו commit, בלי retries. בכל ריצה שמונים עברו, אפס נכשלו, ושתיים דולגו. כאן הדוח הציבורי, ולכל ריצה יש דוח משלה. | Это запуск в GitHub Actions. Я сделал пять запусков подряд на одном коммите, без ретраев. В каждом восемьдесят прошло, ноль упало и два пропущено. Вот публичный отчёт, у каждого запуска свой отчёт. | `docs/STR.md`, section 1 |
| 2:00–2:20 | Tab 7, `docs/STR.md`, section 4 | The defects table and the skipped tests | מצאנו ארבעה באגים במוצר, והם רשומים ב-SpiraTest. שתי הבדיקות שדולגו קשורות לשניים מהם, והבדיקות עצמן נשארו בקוד. המגבלות כתובות כאן בכנות. למשל, לא עשיתי בדיקות עומס. | Мы нашли четыре дефекта продукта, они заведены в SpiraTest. Два пропущенных теста связаны с двумя из них, сами проверки остались в коде. Ограничения честно описаны здесь. Например, нагрузочных тестов я не делал. | `docs/STR.md`, sections 4, 5 |
| 2:20–2:35 | Tab 8, the repository README | The table of links and the AI section | ב-README יש קישורים לכל המסמכים: STP, STR, השינויים והשימוש ב-AI. תודה רבה. | В README есть ссылки на все документы: STP, STR, изменения и использование ИИ. Большое спасибо. | `README.md` |

## Recording checklist

- [ ] Close private tabs and hide secrets/notifications.
- [ ] Open all required pages/files and verify access.
- [ ] Record screen and voice in Jam.dev.
- [ ] Verify the video actually plays with audio.
- [ ] Obtain the Jam.dev share link (not a different video host).
- [ ] Check that the link opens without logging in.
- [ ] Add the real link to the submission documentation/form.

## Unverified claims / missing evidence

- Stonewake has not confirmed D-01 and D-02, so the narration says the defects are registered, not that Stonewake accepted them.
- SpiraTest links may need a login. The script does not open them.
- The self-healing demo was not run, so it is left out of the narration.
- The script omits "stable" and "no flakiness": five runs are evidence, not proof.
