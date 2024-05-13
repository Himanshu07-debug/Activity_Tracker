class TimetrackersController < ApplicationController
  before_action :set_timetracker, only: %i[ show update destroy ]

  # GET /timetrackers
  def index
    @timetrackers = Timetracker.all

    render json: @timetrackers
  end

  # GET /timetrackers/1
  def show
    render json: @timetracker
  end

  def details
    request_body = request.body.read

    data = JSON.parse(request_body)


    email = data["email"]


    user = User.find_by(email: email)

    if user.nil?
      Rails.logger.error "User not found for email: #{email}"
    else
      user_id = user.id
      Rails.logger.info "User found. user_id: #{user_id}"

       data.each do |key, entries|
        next if key == "email"

        entries.each do |entry|
          url = entry["url"]
          Rails.logger.info "url: #{url}"
          tracked_seconds = entry["trackedSeconds"]
          minutes = tracked_seconds / 60.0 

          tracker = Timetracker.find_by(user_id: user_id, domain: url)
          if tracker.nil?
            Timetracker.create(user_id: user_id, domain: url, tracked_minute: minutes, tracked_seconds: tracked_seconds)
          else
            tracker.update(tracked_minute: tracker.tracked_minute + minutes, tracked_seconds: tracker.tracked_seconds + tracked_seconds)
          end
        end
      end
    end
  end
  

  def user_web_details

    email = params[:email]
  

    user = User.find_by(email: email)
  
    if user.nil?

      render json: { error: "User not found for email: #{email}" }, status: :not_found
    else
      # Get the user ID
      user_id = user.id
      Rails.logger.info "User found. user_id: #{user_id}"
  

      user_tracks = Timetracker.where(user_id: user_id)
  
      if user_tracks.empty?
        render json: { error: "No tracking data found for user with email: #{email}" }, status: :not_found
      else

        user_details = []
  

        user_tracks.each do |track|
          user_details << {
            track_id: track.id,
            domain: track.domain,
            tracked_minutes: track.tracked_minute,
            tracked_seconds: track.tracked_seconds
          }
        end
  

        render json: user_details, status: :ok
      end
    end
  end

  # POST /timetrackers
  def create
    @timetracker = Timetracker.new(timetracker_params)

    if @timetracker.save
      render json: @timetracker, status: :created, location: @timetracker
    else
      render json: @timetracker.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /timetrackers/1
  def update
    if @timetracker.update(timetracker_params)
      render json: @timetracker
    else
      render json: @timetracker.errors, status: :unprocessable_entity
    end
  end

  # DELETE /timetrackers/1
  def destroy
    @timetracker.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_timetracker
      @timetracker = Timetracker.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def timetracker_params
      params.require(:timetracker).permit(:user_id, :domain, :tracked_minute, :tracked_seconds)
    end
end
