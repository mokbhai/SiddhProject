-- -- Adding Authors
-- INSERT INTO public."Authors" ("AuthorName") values ('Mokshit Jain');
-- delete from "Authors" where "Id" = 2;
-- SELECT * from public."Authors";

-- -- Adding Books
-- INSERT INTO public."Books" ("BookName", "AuthorId") values ('Let us see', 1);
-- INSERT INTO public."Books" ("BookName", "AuthorId") values ('6am club', 1);
-- INSERT INTO public."Books" ("BookName", "AuthorId") values ('Epic Shit', 1);
-- select * from "Books";

-- -- Adding Users
-- INSERT INTO "Users" ("UserName") values ('Adi');
-- INSERT INTO "Users" ("UserName") values ('Not issue');
-- select * from "Users";

-- -- Show Books With Author Name which are currently available
-- SELECT "Books"."Id", "BookName", "AuthorName" FROM "Books" 
-- LEFT JOIN "Authors"
-- ON "Books"."AuthorId" = "Authors"."Id"
--     where "Books"."Id" not in (select "BookId" from "UserBooks" where "IsReturned" = false);

-- -- Issue Books
-- SET TIMEZONE = 'Asia/Calcutta';
-- insert into "UserBooks" ("BookId", "UserId", "IssueDate", "IsReturned") VALUES (1, 1, now(),  false);
-- insert into "UserBooks" ("BookId", "UserId", "IssueDate", "IsReturned") VALUES (2, 2, now(), false);
-- insert into "UserBooks" ("BookId", "UserId", "IssueDate", "IsReturned") VALUES (3, 1, now(), true);

-- -- Show Issued Books
-- select "UserBooks"."Id" as "Id", "BookName" as "Book Name", "AuthorName" as "Auther Name", "UserName" AS "User Name", "IssueDate" as "Issue Date", "IsReturned" 
-- from "UserBooks"
-- left join "Books" B
-- ON B."Id" = "UserBooks"."BookId"
-- left join "Users" U on U."Id" = "UserBooks"."UserId"
-- left join "Authors" A on A."Id" = B."AuthorId";

-- -- show author book count
-- select "AuthorId", "AuthorName", count(*) from "Authors"
-- left join "Books" b
-- on b."AuthorId" = "Authors"."Id"
-- group by "AuthorId", "AuthorName";

-- -- show all issued books
-- SELECT "Books"."Id", "BookName", "AuthorName" FROM "Books"
--                                                        LEFT JOIN "Authors"
--                                                                  ON "Books"."AuthorId" = "Authors"."Id"
-- where "Books"."Id" in (select "BookId" from "UserBooks" where "IsReturned" = false);

-- -- show users with issued book count isreturned - false
-- select * from "Users"
-- left join "UserBooks" UB 
-- on "Users"."Id" = UB."UserId"
-- where "IsReturned" = false;

-- -- statics - Popular book of the month and year
-- select "BookId", count(*) as "NoOfTimeIssued" from "UserBooks"
-- group by "BookId"
-- order by "NoOfTimeIssued" desc;

-- -- avg issue book in a month per author
-- select B2."AuthorId", count(*) as "NoOfTimeIssued" from "UserBooks" UB 
-- left join "Books" B2 on B2."Id" = UB."BookId"
-- left join "Authors" A on B2."AuthorId" = A."Id"
-- group by B2."AuthorId"
-- order by "NoOfTimeIssued" desc;

-- -- popular author of month