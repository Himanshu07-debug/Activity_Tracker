require "test_helper"

class TimetrackersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @timetracker = timetrackers(:one)
  end

  test "should get index" do
    get timetrackers_url, as: :json
    assert_response :success
  end

  test "should create timetracker" do
    assert_difference("Timetracker.count") do
      post timetrackers_url, params: { timetracker: { domain: @timetracker.domain, tracked_minute: @timetracker.tracked_minute, tracked_seconds: @timetracker.tracked_seconds, user_id: @timetracker.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show timetracker" do
    get timetracker_url(@timetracker), as: :json
    assert_response :success
  end

  test "should update timetracker" do
    patch timetracker_url(@timetracker), params: { timetracker: { domain: @timetracker.domain, tracked_minute: @timetracker.tracked_minute, tracked_seconds: @timetracker.tracked_seconds, user_id: @timetracker.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy timetracker" do
    assert_difference("Timetracker.count", -1) do
      delete timetracker_url(@timetracker), as: :json
    end

    assert_response :no_content
  end
end
