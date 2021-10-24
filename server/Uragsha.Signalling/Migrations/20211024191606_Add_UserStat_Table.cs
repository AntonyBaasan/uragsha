using Microsoft.EntityFrameworkCore.Migrations;

namespace Uragsha.Signalling.Migrations
{
    public partial class Add_UserStat_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserStat",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(767)", nullable: false),
                    SessionCount = table.Column<int>(type: "int", nullable: false),
                    WeeklySessionCount = table.Column<int>(type: "int", nullable: false),
                    InRowSessionCount = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "varchar(767)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStat", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserStat_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserStat_UserId",
                table: "UserStat",
                column: "UserId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserStat");
        }
    }
}
