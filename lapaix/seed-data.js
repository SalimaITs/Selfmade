/* LA PAIX – Beispielunternehmen (Hansen & Partner Logistik GmbH, fiktiv).
   Eine Quelle für zwei Zwecke:
   1) wird per Skript als Startdaten in die Datenbank geschrieben,
   2) dient im Offline-/Vorschaumodus als lokale Beispieldaten. */
(function (root) {
  function build() {
    var company = { name: "Hansen & Partner Logistik GmbH", sites: "Hamburg · Dubai", example: true };

    var members = [
      { id: "m1", name: "Dr. Martin Weber", role: "Geschäftsführer", roleEn: "Managing Director", dept: "mgmt", secret: "a91f3c7e52d8b604" },
      { id: "m2", name: "Sabine Krüger", role: "Leitung Finanzen", roleEn: "Head of Finance", dept: "finance", secret: "4be07d19c3a2f856" },
      { id: "m3", name: "Aylin Demir", role: "Buchhaltung", roleEn: "Accounting", dept: "finance", secret: "d2c85a6f01e94b37" },
      { id: "m4", name: "Jonas Hoffmann", role: "IT-Leitung", roleEn: "Head of IT", dept: "it", secret: "7f3e21b9d064ac58" },
      { id: "m5", name: "Fatima Al-Mansouri", role: "Office Management Dubai", roleEn: "Office Manager Dubai", dept: "dubai", secret: "c06b9e42a7d153f8" },
      { id: "m6", name: "Lukas Brandt", role: "IT-Helpdesk", roleEn: "IT Help Desk", dept: "it", secret: "18ad5f7c3e90b264" }
    ];

    var policy = {
      version: 1, payment: true, paymentThreshold: 5000, bank: true, password: true, data: true, supplier: true,
      fourEyes: true, fourEyesThreshold: 25000, expiryMin: 10, updatedAt: Date.UTC(2025, 10, 3, 9, 0)
    };

    var progress = {
      m1: { c1: 3 }, m2: { c1: 3, c2: 3, c3: 3 }, m3: { c1: 3, c2: 2 },
      m4: { c1: 3, c2: 3, c3: 3 }, m5: { c1: 3 }, m6: { c1: 2, c3: 3 }
    };
    var acks = { m1: 1, m2: 1, m3: 1, m4: 1 };

    // Abgeschlossene Monate: [Monat, Anfragen, bestätigt, abgelehnt, abgelaufen, Schulungsquote %]
    var rows = [
      ["2025-11", 18, 15, 1, 2, 34], ["2025-12", 26, 22, 2, 2, 41], ["2026-01", 41, 36, 1, 4, 49],
      ["2026-02", 55, 50, 3, 2, 58], ["2026-03", 63, 57, 2, 4, 63], ["2026-04", 71, 66, 4, 1, 69],
      ["2026-05", 84, 78, 2, 4, 74], ["2026-06", 92, 86, 3, 3, 78], ["2026-07", 88, 83, 2, 3, 80],
      ["2026-08", 97, 91, 5, 1, 84], ["2026-09", 118, 111, 4, 3, 88], ["2026-10", 132, 124, 6, 2, 91]
    ];
    // Vorlagen für abgewehrte Angriffe: Art, Kanal, Betrag, Abteilung
    var attacks = [
      ["payment", "video", 48000, "finance"], ["bank", "email", 18650, "finance"], ["password", "phone", 0, "it"],
      ["payment", "phone", 9800, "dubai"], ["data", "email", 0, "mgmt"], ["payment", "chat", 23400, "finance"],
      ["bank", "phone", 31200, "finance"], ["password", "chat", 0, "it"], ["payment", "video", 74500, "dubai"],
      ["supplier", "email", 12400, "finance"], ["data", "phone", 0, "it"], ["payment", "email", 38900, "mgmt"]
    ];
    var shares = { finance: .44, it: .24, mgmt: .14, dubai: .18 };
    var months = {};
    var k = 0;
    rows.forEach(function (r, i) {
      var depts = {}, used = 0, keys = Object.keys(shares);
      keys.forEach(function (d, j) {
        var n = j === keys.length - 1 ? r[1] - used : Math.round(r[1] * shares[d]);
        used += n; depts[d] = { req: n, rej: 0 };
      });
      var incidents = [], prevented = 0;
      for (var a = 0; a < r[3]; a++) {
        var t = attacks[k++ % attacks.length];
        var day = 3 + ((a * 7 + i * 3) % 24);
        incidents.push({ type: t[0], channel: t[1], amount: t[2], dept: t[3], day: day });
        prevented += t[2];
        depts[t[3]].rej++;
      }
      months[r[0]] = {
        month: r[0], requests: r[1], confirmed: r[2], rejected: r[3], expired: r[4], prevented: prevented,
        training: r[5], ack: Math.min(100, 40 + i * 5), depts: depts, incidents: incidents, closed: true, example: true
      };
    });

    function ts(d, h, m) { return Date.UTC(2026, 10, d, h - 1, m); }
    var verifications = [
      { id: "v1", createdAt: ts(1, 9, 12), requesterId: "m3", approverIds: ["m2"], approvals: ["m2"], type: "payment", channel: "email", amount: 7420, note: "Rechnung Spedition Nordlicht, Fälligkeit heute", status: "confirmed", method: "app", resolvedAt: ts(1, 9, 14), dept: "finance", example: true },
      { id: "v2", createdAt: ts(1, 11, 40), requesterId: "m6", approverIds: ["m4"], approvals: ["m4"], type: "password", channel: "phone", amount: 0, note: "Passwort-Reset für J. Hoffmann angefragt", status: "confirmed", method: "code", resolvedAt: ts(1, 11, 41), dept: "it", example: true },
      { id: "v3", createdAt: ts(1, 16, 40), requesterId: "m3", approverIds: ["m1", "m2"], approvals: [], type: "payment", channel: "video", amount: 48000, note: "Videoanruf vom Geschäftsführer: dringende Überweisung nach Dubai vor Bankschluss", status: "rejected", method: "app", resolvedAt: ts(1, 16, 43), rejectedBy: "m1", dept: "finance", example: true },
      { id: "v4", createdAt: ts(2, 8, 55), requesterId: "m5", approverIds: ["m2"], approvals: ["m2"], type: "bank", channel: "email", amount: 0, note: "Lieferant Al Noor Trading meldet neue Bankverbindung", status: "confirmed", method: "app", resolvedAt: ts(2, 9, 3), dept: "dubai", example: true },
      { id: "v5", createdAt: ts(2, 10, 20), requesterId: "m2", approverIds: ["m1"], approvals: [], type: "data", channel: "chat", amount: 0, note: "Anfrage nach Gehaltsliste per WhatsApp", status: "expired", method: "", resolvedAt: ts(2, 10, 30), dept: "finance", example: true }
    ];

    return { company: company, members: members, policy: policy, progress: progress, acks: acks, months: months, verifications: verifications };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = build;
  else root.LAPAIX_DEMO = build;
})(this);
