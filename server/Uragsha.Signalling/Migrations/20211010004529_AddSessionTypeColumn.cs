using Microsoft.EntityFrameworkCore.Migrations;

namespace Uragsha.Signalling.Migrations
{
    public partial class AddSessionTypeColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SessionType",
                table: "SessionRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SessionType",
                table: "SessionRequests");
        }
    }
}
