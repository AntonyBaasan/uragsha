using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Uragsha.Signalling.Migrations
{
    public partial class Add_Comment_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GivenSessionRequestCommentId",
                table: "SessionRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceivedSessionRequestCommentId",
                table: "SessionRequests",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SessionRequestComment",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(767)", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsSuccessfulWorkout = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    GivenSessionRequestId = table.Column<string>(type: "varchar(767)", nullable: true),
                    ReceivedSessionRequestId = table.Column<string>(type: "varchar(767)", nullable: true),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionRequestComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionRequestComment_SessionRequests_GivenSessionRequestId",
                        column: x => x.GivenSessionRequestId,
                        principalTable: "SessionRequests",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SessionRequestComment_SessionRequests_ReceivedSessionRequest~",
                        column: x => x.ReceivedSessionRequestId,
                        principalTable: "SessionRequests",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionRequestComment_GivenSessionRequestId",
                table: "SessionRequestComment",
                column: "GivenSessionRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SessionRequestComment_ReceivedSessionRequestId",
                table: "SessionRequestComment",
                column: "ReceivedSessionRequestId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionRequestComment");

            migrationBuilder.DropColumn(
                name: "GivenSessionRequestCommentId",
                table: "SessionRequests");

            migrationBuilder.DropColumn(
                name: "ReceivedSessionRequestCommentId",
                table: "SessionRequests");
        }
    }
}
