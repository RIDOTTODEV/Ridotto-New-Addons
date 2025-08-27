/* import { defineAsyncComponent, ref, inject, watch } from "vue";
import { Loading, useQuasar } from "quasar";
import { useGuestStore } from "src/stores/guest";
import { queryParams } from "src/utils/types";
import { storeToRefs } from "pinia";
import { i18n } from "boot/i18n";

export function useGuestList() {
  const bus = inject("bus");
  const $q = useQuasar();
  const guestStore = useGuestStore();
  const {
    flightTicketTypes,
    boardTypes,
    roomTypes,
    visitorCategories,
    expenseTypes,
    expenseParameters,
  } = storeToRefs(guestStore);
  const guestListFilterParams = ref({
    ...queryParams(),
  });
  const showCreateGuestCard = ref(false);
  const selectedGuest = ref(null);
  const hotelReservationFormValues = ref({
    players: [],
    status: "Pending",
    hotelFlightInfo: {
      //expenseDirection: 1,
      checkIn: "",
      checkOut: "",
      dayCount: 1,
      roomTypeId: null,
      roomType: "",
      roomNo: null,
      boardType: "BB",
      roomPrice: 0,
      roomTotalPrice: 0,
      expenseUse: true,
      flight: "",
      ticketType: "Casino",
      from: "",
      to: "",
      to2: "",
      pnr: "",
      pnr2: "",
      flightTicketPrice: 0,
      isBusiness: false,
    },
    note: "",
    remark: "",
    phone: true,
    minibar: true,
    spa: true,
    fb: true,
    expenses: [],
  });
  const hotelReservationFilterParams = ref({
    ...queryParams(),
  });
  const onHandleSubmitPlayerName = async (type, $event) => {
    $event.preventDefault();
    const str = $event.target.value;
    Loading.show({
      spinnerSize: 150,
      spinnerColor: "primary",
      message: "Loading...",
    });
    const players = await guestStore.searchPlayer(str);
    Loading.hide();

    if (!players || players.length === 0) {
      $q.notify({
        type: "warning",
        message: i18n.global.t("notFound"),
        position: "top",
      });
      return;
    }

    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/PlayerDialog.vue")
      ),
      componentProps: {
        players: players,
      },
    }).onOk(async (data) => {
      if (type === "player") {
        hotelReservationFormValues.value.players[0].playerId = data.id;
        hotelReservationFormValues.value.players[0].playerFullName =
          data.name + " " + data.surname;
        hotelReservationFormValues.value.players[0].playerCategoryId =
          data.categoryId || null;
        hotelReservationFormValues.value.players[0].playerCategoryName =
          data.categoryName || "";
      } else if (type === "roomMate") {
        // Add room mate as additional player
        const fullName = `${data.name} ${data.surname}`;

        // Check if the player is already in the players list
        if (
          hotelReservationFormValues.value.players.some(
            (p) => p.playerFullName === fullName
          )
        ) {
          $q.notify({
            type: "warning",
            message: i18n.global.t("playerAlreadyAdded"),
            position: "top",
          });
        } else {
          hotelReservationFormValues.value.players.push({
            hotelReservationId: 0,
            playerId: data.id,
            playerFullName: fullName,
            playerCategoryId: data.categoryId || null,
            playerCategoryName: data.categoryName || "",
          });
        }
      } else if (type === "guest") {
        hotelReservationFormValues.value.players[0].playerId = data.id;
        hotelReservationFormValues.value.players[0].playerFullName =
          data.name + " " + data.surname;
        hotelReservationFormValues.value.players[0].playerCategoryId =
          data.categoryId || null;
        hotelReservationFormValues.value.players[0].playerCategoryName =
          data.categoryName || "";
      } else if (type === "pendingPlayer") {
        pendingReservationFormValues.value.playerId = data.id;
        pendingReservationFormValues.value.playerName =
          data.name + " " + data.surname;
        pendingReservationFormValues.value.playerSurname = data.surname;
      } else if (type === "pendingRoomMate") {
        pendingReservationFormValues.value.roomMateId = data.id;
        pendingReservationFormValues.value.roomMateName =
          data.name + " " + data.surname;
        pendingReservationFormValues.value.roomMateSurName = data.surname;
      }
    });
  };
  const onClickCreateHotelReservation = () => {
    // Reset form values for new reservation
    hotelReservationFormValues.value = {
      players: [],
      status: "Pending",
      hotelFlightInfo: {
        //expenseDirection: 1,
        checkIn: "",
        checkOut: "",
        dayCount: 1,
        roomTypeId: null,
        roomType: "",
        roomNo: null,
        boardType: "BB",
        roomPrice: 0,
        roomTotalPrice: 0,
        expenseUse: true,
        flight: "",
        ticketType: "Casino",
        from: "",
        to: "",
        to2: "",
        pnr: "",
        pnr2: "",
        flightTicketPrice: 0,
        isBusiness: false,
      },
      note: "",
      remark: "",
      phone: true,
      minibar: true,
      spa: true,
      fb: true,
      expenses: [],
    };

    showCreateGuestCard.value = true;
  };
  const onSubmitNewReservation = async () => {
    let data = { ...hotelReservationFormValues.value };

    if (data.id) {
      // Update işlemi için sadece gerekli alanları gönder
      const updateData = {
        hotelReservationId: data.id,
        status: data.status || "Pending",
        note: data.note || "",
        remark: data.remark || "",
        phone: data.phone || false,
        minibar: data.minibar || false,
        spa: data.spa || false,
        fb: data.fb || false,
      };

      const response = await guestStore.updateHotelReservation(updateData);
      if (response) {
        showCreateGuestCard.value = false;
        // Reload the guest list after update
        await guestStore.getAllHotelReservations(guestListFilterParams.value);
      }
    } else {
      // Create işlemi için tüm datayı gönder
      data.hotelFlightInfo.isBusiness =
        data.hotelFlightInfo.isBusiness === true;
      const response = await guestStore.createHotelReservation(data);
      if (response) {
        showCreateGuestCard.value = false;
        // Reload the guest list after creation
        await guestStore.getAllHotelReservations(guestListFilterParams.value);
      }
    }
  };
  const onClickRemoveHotelGuestReservation = async (props) => {
    await $q
      .dialog({
        title: i18n.global.t("delete"),
        message: i18n.global.t("deleteMessage", {
          name: props.playerFullName,
        }),
        persistent: true,
        focus: "cancel",
        ok: {
          flat: true,
          color: "negative",
          label: i18n.global.t("delete"),
          class: "text-capitalize",
        },
        cancel: {
          flat: true,
          color: "primary",
          label: i18n.global.t("cancel"),
          class: "text-capitalize",
        },
        transitionShow: "slide-up",
        transitionHide: "slide-down",
      })
      .onOk(async () => {
        await guestStore.deleteHotelReservation(props.id);
        await guestStore.getAllHotelReservations(
          hotelReservationFilterParams.value
        );
      });
  };
  const onClickEditHotelGuestReservation = async (props) => {
    showCreateGuestCard.value = true;

    const ownerPlayer = props.players.find(
      (player) => player.roomOwner === true
    );
    console.log(ownerPlayer);
    const playerFullName = ownerPlayer.playerFullName.split(" ");
    const player = {
      playerId: ownerPlayer.playerId,
      id: ownerPlayer.playerId,
      name: playerFullName[0],
      surname: playerFullName[2],
    };
    selectedGuest.value = player;
    hotelReservationFormValues.value = {
      ...props,
      expenses: [], // Expense'ler watch fonksiyonu tarafından yüklenecek
      hotelFlightInfo: {
        //expenseDirection: props.expenseDirection || 1,
        checkIn: props.checkIn || "",
        checkOut: props.checkOut || "",
        dayCount: props.dayCount || 0,
        roomTypeId: props.roomTypeId || null,
        roomType: props.roomType || "",
        roomNo: props.roomNo || null,
        boardType: props.boardType || "BB",
        roomPrice: props.roomPrice || 0,
        roomTotalPrice: props.roomTotalPrice || 0,
        expenseUse: props.expenseUse || false,
        flight: props.flight || "",
        ticketType: props.ticketType || "Casino",
        from: props.from || "",
        to: props.to || "",
        to2: props.to2 || "",
        pnr: props.pnr || "",
        pnr2: props.pnr2 || "",
        flightTicketPrice: props.flightTicketPrice || 0,
        isBusiness: props.isBusiness === true,
      },
    };
  };
  const roomTypeFilterParams = ref({
    ...queryParams(),
  });
  const onClickCreateRoomType = () => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/RoomTypeFormDialog.vue")
      ),
      componentProps: {
        formValues: {
          id: 0,
          name: "",
          transType: null,
          price: 0,
          multiplier: 0,
          isActive: true,
        },
        actionFn: guestStore.createRoomType,
      },
    }).onOk(async (data) => {
      await guestStore.fetchRoomTypes(roomTypeFilterParams.value);
    });
  };
  const onClickEditRoomType = (props) => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/RoomTypeFormDialog.vue")
      ),
      componentProps: {
        formValues: {
          id: props.id,
          name: props.name,
          description: props.description,
          price: props.price,
          multiplier: props.multiplier,
          isActive: props.isActive,
        },
        actionFn: guestStore.updateRoomType,
      },
    }).onOk(async (data) => {
      await guestStore.fetchRoomTypes(roomTypeFilterParams.value);
    });
  };
  const onClickRemoveRoomType = async (props) => {
    await $q
      .dialog({
        title: i18n.global.t("delete"),
        message: i18n.global.t("deleteMessage", { name: props.name }),
        persistent: true,
        focus: "cancel",
        ok: {
          flat: true,
          color: "negative",
          label: i18n.global.t("delete"),
          class: "text-capitalize",
        },
        cancel: {
          flat: true,
          color: "primary",
          label: i18n.global.t("cancel"),
          class: "text-capitalize",
        },
        transitionShow: "slide-up",
        transitionHide: "slide-down",
      })
      .onOk(async () => {
        await guestStore.deleteRoomType(props.id);
        await guestStore.fetchRoomTypes(roomTypeFilterParams.value);
      });
  };

  const visitorCategoryFilterParams = ref({
    ...queryParams(),
  });
  const onClickCreateVisitorCategory = () => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/VisitorCategoryFormDialog.vue")
      ),
      componentProps: {
        formValues: {
          id: 0,
          name: "",
          isActive: true,
        },
        actionFn: guestStore.createVisitorCategory,
      },
    }).onOk(async (data) => {
      await guestStore.fetchVisitorCategories(
        visitorCategoryFilterParams.value
      );
    });
  };
  const onClickEditVisitorCategory = (props) => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/VisitorCategoryFormDialog.vue")
      ),
      componentProps: {
        formValues: {
          id: props.id,
          name: props.name,
          isActive: props.isActive,
        },
        actionFn: guestStore.updateVisitorCategory,
      },
    }).onOk(async (data) => {
      await guestStore.fetchVisitorCategories(
        visitorCategoryFilterParams.value
      );
    });
  };
  const onClickRemoveVisitorCategory = async (props) => {
    await $q
      .dialog({
        title: i18n.global.t("delete"),
        message: i18n.global.t("deleteMessage", { name: props.name }),
        persistent: true,
        focus: "cancel",
        ok: {
          flat: true,
          color: "negative",
          label: i18n.global.t("delete"),
          class: "text-capitalize",
        },
        cancel: {
          flat: true,
          color: "primary",
          label: i18n.global.t("cancel"),
          class: "text-capitalize",
        },
        transitionShow: "slide-up",
        transitionHide: "slide-down",
      })
      .onOk(async () => {
        await guestStore.deleteVisitorCategory(props.id);
        await guestStore.fetchVisitorCategories(
          visitorCategoryFilterParams.value
        );
      });
  };

  const pendingReservationFormValues = ref({
    playerId: null,
    playerName: "",
    playerSurname: "",
    playerCategoryId: null,
    playerCategoryName: "",

    roomMateId: null,
    roomMateName: "",
    roomMateSurName: "",

    checkIn: "",
    checkOut: "",

    ticketCount: null,
    roomCount: null,
    note: "",
    bearer: "",
    status: "Pending",
  });
  const pendingReservationFilterParams = ref({
    ...queryParams(),
    status: "Pending",
  });
  const onSubmitPendingReservation = async () => {
    let data = { ...pendingReservationFormValues.value };
    if (data.id) {
      const response = await guestStore.updatePendingReservation(data);
      if (response) {
        showCreateGuestCard.value = false;
      }
    } else {
      const response = await guestStore.createPendingReservation(data);
      if (response) {
        showCreateGuestCard.value = false;
      }
    }
  };
  const onClickEditPendingReservation = (props) => {
    showCreateGuestCard.value = true;
    pendingReservationFormValues.value = {
      id: props.id,
      playerId: props.playerId,
      playerName: props.playerName,
      playerSurname: props.playerSurname,
      playerCategoryId: props.playerCategoryId,
      playerCategoryName: props.playerCategoryName,

      roomMateId: props.roomMateId,
      roomMateName: props.roomMateName,
      roomMateSurName: props.roomMateSurName,

      checkIn: props.checkIn,
      checkOut: props.checkOut,
      bearer: props.bearer,
      ticketCount: props.ticketCount,
      roomCount: props.roomCount,
      note: props.note,
      status: props.status,
    };
  };
  const onClickRemovePendingReservation = async (props) => {
    await $q
      .dialog({
        title: i18n.global.t("delete"),
        message: i18n.global.t("deleteMessage", {
          name: props.playerName,
        }),
        persistent: true,
        focus: "cancel",
        ok: {
          flat: true,
          color: "negative",
          label: i18n.global.t("delete"),
          class: "text-capitalize",
        },
        cancel: {
          flat: true,
          color: "primary",
              label: i18n.global.t("cancel"),
          class: "text-capitalize",
        },
        transitionShow: "slide-up",
        transitionHide: "slide-down",
      })
      .onOk(async () => {
        await guestStore.deletePendingReservation(props.id);
        await guestStore.fetchPendingReservations(
          pendingReservationFilterParams.value
        );
      });
  };

  const hideColumns = ref([]);
  const toggleHideColumns = ref(true);

  // Watch for expense parameters to update hideColumns
  watch(
    () => expenseParameters.value,
    (newParams) => {
      hideColumns.value = [
        ...newParams.map((param) => `expense_${param.id}`),
        "totalExpense",
      ];
    },
    { immediate: true }
  );

  const onHideColumns = () => {
    toggleHideColumns.value = !toggleHideColumns.value;
    bus.emit("hideColumns", hideColumns.value, toggleHideColumns.value);
  };

  const expenseParameterFilterParams = ref({
    ...queryParams(),
  });
  const onClickCreateExpenseParameter = () => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/ExpenseParameterDialog.vue")
      ),
      componentProps: {
        formValues: {
          name: "",
          amount: 0,
          dailyBasedQuantity: false,
        },
        actionFn: guestStore.createExpenseParameter,
      },
    }).onOk(async (data) => {
      await guestStore.fetchExpenseParameters(
        expenseParameterFilterParams.value
      );
    });
  };
  const onClickEditExpenseParameter = (props) => {
    $q.dialog({
      component: defineAsyncComponent(() =>
        import("../pages/GuestList/components/ExpenseParameterDialog.vue")
      ),
      componentProps: {
        formValues: { ...props },
        actionFn: guestStore.updateExpenseParameter,
      },
    }).onOk(async (data) => {
      await guestStore.fetchExpenseParameters(
        expenseParameterFilterParams.value
      );
    });
  };
  const onClickRemoveExpenseParameter = async (props) => {
    await $q
      .dialog({
        title: i18n.global.t("delete"),
        message: i18n.global.t("deleteMessage", { name: props.name }),
        persistent: true,
        focus: "cancel",
        ok: {
          flat: true,
          color: "negative",
          label: i18n.global.t("delete"),
        },
      })
      .onOk(async () => {
        await guestStore.deleteExpenseParameter(props.id);
        await guestStore.fetchExpenseParameters(
          expenseParameterFilterParams.value
        );
      });
  };
  return {
    guestStore,
    guestListFilterParams,
    roomTypeFilterParams,
    visitorCategoryFilterParams,
    hotelReservationFormValues,
    flightTicketTypes,
    boardTypes,
    roomTypes,
    visitorCategories,
    showCreateGuestCard,
    pendingReservationFormValues,
    pendingReservationFilterParams,
    onClickCreateHotelReservation,
    onClickCreateRoomType,
    onClickEditRoomType,
    onClickRemoveRoomType,
    onClickCreateVisitorCategory,
    onClickEditVisitorCategory,
    onClickRemoveVisitorCategory,
    onHandleSubmitPlayerName,
    onSubmitNewReservation,
    onClickEditHotelGuestReservation,
    onClickRemoveHotelGuestReservation,
    onSubmitPendingReservation,
    onClickEditPendingReservation,
    onClickRemovePendingReservation,
    onHideColumns,
    toggleHideColumns,
    expenseParameterFilterParams,
    onClickCreateExpenseParameter,
    onClickEditExpenseParameter,
    onClickRemoveExpenseParameter,
    expenseParameters,
    selectedGuest,
  };
}
 */
