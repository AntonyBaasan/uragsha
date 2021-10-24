﻿// <auto-generated />
using System;
using Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Uragsha.Signalling.Migrations
{
    [DbContext(typeof(MainDbContext))]
    [Migration("20211024191606_Add_UserStat_Table")]
    partial class Add_UserStat_Table
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 64)
                .HasAnnotation("ProductVersion", "5.0.10");

            modelBuilder.Entity("Entity.Models.Identity.UserEntity", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<string>("DisplayName")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("PhotoUrl")
                        .HasColumnType("text");

                    b.Property<int>("Plan")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Entity.Models.Identity.UserRoleEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("Entity.Models.Identity.UserStatEntity", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<int>("InRowSessionCount")
                        .HasColumnType("int");

                    b.Property<int>("SessionCount")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(767)");

                    b.Property<int>("WeeklySessionCount")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("UserStat");
                });

            modelBuilder.Entity("Entity.Models.SessionEntity", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("varchar(767)");

                    b.Property<DateTime?>("End")
                        .HasColumnType("datetime");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<DateTime>("Start")
                        .HasColumnType("datetime");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("Entity.Models.SessionRequestCommentEntity", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<string>("GivenSessionRequestId")
                        .HasColumnType("varchar(767)");

                    b.Property<bool>("IsSuccessfulWorkout")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("ReceivedSessionRequestId")
                        .HasColumnType("varchar(767)");

                    b.Property<DateTime>("UpdatedDate")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.HasIndex("GivenSessionRequestId")
                        .IsUnique();

                    b.HasIndex("ReceivedSessionRequestId")
                        .IsUnique();

                    b.ToTable("SessionRequestComment");
                });

            modelBuilder.Entity("Entity.Models.SessionRequestEntity", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(767)");

                    b.Property<DateTime>("End")
                        .HasColumnType("datetime");

                    b.Property<string>("GivenSessionRequestCommentId")
                        .HasColumnType("text");

                    b.Property<string>("ReceivedSessionRequestCommentId")
                        .HasColumnType("text");

                    b.Property<string>("SessionId")
                        .HasColumnType("varchar(767)");

                    b.Property<int>("SessionType")
                        .HasColumnType("int");

                    b.Property<DateTime>("Start")
                        .HasColumnType("datetime");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("SessionId");

                    b.ToTable("SessionRequests");
                });

            modelBuilder.Entity("UserEntityUserRoleEntity", b =>
                {
                    b.Property<int>("RolesId")
                        .HasColumnType("int");

                    b.Property<string>("UsersId")
                        .HasColumnType("varchar(767)");

                    b.HasKey("RolesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("UserEntityUserRoleEntity");
                });

            modelBuilder.Entity("Entity.Models.Identity.UserStatEntity", b =>
                {
                    b.HasOne("Entity.Models.Identity.UserEntity", "User")
                        .WithOne("UserStatEntity")
                        .HasForeignKey("Entity.Models.Identity.UserStatEntity", "UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("User");
                });

            modelBuilder.Entity("Entity.Models.SessionRequestCommentEntity", b =>
                {
                    b.HasOne("Entity.Models.SessionRequestEntity", "GivenSessionRequest")
                        .WithOne("GivenSessionRequestComment")
                        .HasForeignKey("Entity.Models.SessionRequestCommentEntity", "GivenSessionRequestId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("Entity.Models.SessionRequestEntity", "ReceivedSessionRequest")
                        .WithOne("ReceivedSessionRequestComment")
                        .HasForeignKey("Entity.Models.SessionRequestCommentEntity", "ReceivedSessionRequestId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("GivenSessionRequest");

                    b.Navigation("ReceivedSessionRequest");
                });

            modelBuilder.Entity("Entity.Models.SessionRequestEntity", b =>
                {
                    b.HasOne("Entity.Models.SessionEntity", "Session")
                        .WithMany("SessionRequests")
                        .HasForeignKey("SessionId");

                    b.Navigation("Session");
                });

            modelBuilder.Entity("UserEntityUserRoleEntity", b =>
                {
                    b.HasOne("Entity.Models.Identity.UserRoleEntity", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Entity.Models.Identity.UserEntity", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Entity.Models.Identity.UserEntity", b =>
                {
                    b.Navigation("UserStatEntity");
                });

            modelBuilder.Entity("Entity.Models.SessionEntity", b =>
                {
                    b.Navigation("SessionRequests");
                });

            modelBuilder.Entity("Entity.Models.SessionRequestEntity", b =>
                {
                    b.Navigation("GivenSessionRequestComment");

                    b.Navigation("ReceivedSessionRequestComment");
                });
#pragma warning restore 612, 618
        }
    }
}
